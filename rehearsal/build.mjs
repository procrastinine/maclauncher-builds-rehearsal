// Generated dummy producer for the throwaway rehearsal repository only.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {recipeMain} from '../tools/build-source.mjs';
import {helperPackage} from '../tools/helper-package.mjs';
import {preparedBuildInput} from '../tools/prepared-build-inputs.mjs';
const root=path.resolve(import.meta.dirname,'..'),topology=JSON.parse(fs.readFileSync(new URL('./topology.json',import.meta.url))),configuration=JSON.parse(fs.readFileSync(new URL('./config.json',import.meta.url)));
const projects=new Map(topology.components.flatMap(component=>component.projects).map(project=>[project.id,project]));
export function recipeInputs({project}){const fixture=projects.get(project);if(!fixture)throw Error('Unknown dummy project.');return fixture.inputs;}
export async function buildDummy({project,version,arch,output}){
 if(process.env.GITHUB_REPOSITORY&&process.env.GITHUB_REPOSITORY!==topology.repository)throw Error('Dummy recipes run only in the rehearsal repository.');
 const inputs=recipeInputs({project}).map(id=>{const input=preparedBuildInput(id);if(!input)throw Error('Missing real prepared dummy dependency: '+id);const bytes=fs.readFileSync(path.join(input.root,'dummy.txt'));return{id,sha256:crypto.createHash('sha256').update(bytes).digest('hex')};});
 if(configuration.delaySeconds)await new Promise(resolve=>setTimeout(resolve,Math.min(120,configuration.delaySeconds)*1000));
 if(configuration.failBuildProjects?.includes(project))throw Error('Deliberate rehearsal build failure before sealing: '+project);
 const payload=path.join(output,'payload');fs.mkdirSync(payload,{recursive:true});
 const bytes=Buffer.from(JSON.stringify({project,version,arch,inputs})+'\n');fs.writeFileSync(path.join(payload,'dummy.txt'),bytes,{mode:0o644});
 fs.copyFileSync(new URL('./LICENSE',import.meta.url),path.join(payload,'LICENSE'));fs.chmodSync(path.join(payload,'LICENSE'),0o644);
 return helperPackage({id:project,version,arch,output,minimumMacOS:'13.0',sourceSha256:crypto.createHash('sha256').update(fs.readFileSync(new URL(import.meta.url))).digest('hex'),
  record:{kind:'rehearsal-data',inputs},notices:[{name:'MacLauncher Builds source license',license:'See included LICENSE',path:'LICENSE'}]});
}
recipeMain(import.meta,buildDummy);
