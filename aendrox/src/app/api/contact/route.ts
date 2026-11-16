import {NextResponse} from 'next/server';
import {z} from 'zod';
import {services} from '@/lib/data';
const schema=z.object({name:z.string().trim().min(2).max(100),email:z.string().trim().email().max(254),phone:z.string().trim().max(40).optional(),company:z.string().trim().max(150).optional(),service:z.string().refine(s=>services.some(x=>x.full===s)),budget:z.string().max(80).optional(),description:z.string().trim().min(20).max(5000),consent:z.literal(true),website:z.string().max(0).optional()});
const attempts=new Map<string,{count:number,time:number}>();
export async function POST(request:Request){
 const origin=request.headers.get('origin');if(origin&&new URL(origin).host!==request.headers.get('host'))return NextResponse.json({message:'This request is not allowed.'},{status:403});
 if(Number(request.headers.get('content-length')||0)>16000)return NextResponse.json({message:'Your inquiry is too long.'},{status:413});
 const ip=request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()||'local';const now=Date.now();for(const [key,value]of attempts)if(now-value.time>600000)attempts.delete(key);const attempt=attempts.get(ip);if(attempt&&attempt.count>=5)return NextResponse.json({message:'Too many requests. Please try again in ten minutes.'},{status:429});attempts.set(ip,{count:(attempt?.count||0)+1,time:attempt?.time||now});
 let body;try{const raw=await request.text();if(raw.length>16000)return NextResponse.json({message:'Your inquiry is too long.'},{status:413});body=JSON.parse(raw)}catch{return NextResponse.json({message:'Please provide a valid inquiry.'},{status:400})}
 const result=schema.safeParse(body);if(!result.success)return NextResponse.json({message:'Please check your name, email, service, project description (at least 20 characters), and consent.'},{status:400});
 const url=process.env.SUPABASE_URL;const key=process.env.SUPABASE_SERVICE_ROLE_KEY;if(!url||!key)return NextResponse.json({message:'The contact backend is not configured yet. Your inquiry has not been saved or sent. Please follow the setup guide in the project README to enable submissions.'},{status:503});
 try{const {website,...submission}=result.data;void website;const response=await fetch(`${url.replace(/\/$/,'')}/rest/v1/contact_submissions`,{method:'POST',headers:{'Content-Type':'application/json',apikey:key,Authorization:`Bearer ${key}`,Prefer:'return=minimal'},body:JSON.stringify(submission),signal:AbortSignal.timeout(10000)});if(!response.ok)throw new Error('Storage failed');return NextResponse.json({message:'Thank you. Your inquiry has been saved successfully.'},{status:201})}catch{return NextResponse.json({message:'We couldn’t save your inquiry. Please try again later.'},{status:502})}
}

