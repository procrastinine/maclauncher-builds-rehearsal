// Registry-only smoke checks for generated fixtures; production engine tests are not claimed.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {readProjects} from '../lib/projects.mjs';
import {recipeInputs} from './build.mjs';
const root=new URL('../',import.meta.url).pathname,topology=JSON.parse(fs.readFileSync(new URL('./topology.json',import.meta.url)));
test('dummy registry contains four compact components, declared inputs and Ubuntu-only records',()=>{
 const projects=readProjects(root,{resolvePins:false}).projects;
 assert.equal(topology.components.length,4);assert.equal(projects.length,6);
 for(const project of projects)for(const record of Array.isArray(project.build)?project.build:[project.build])assert.ok(Object.values(record.runners).every(runner=>runner==='ubuntu-24.04'));
 for(const component of topology.components)for(const project of component.projects){assert.deepEqual(recipeInputs({project:project.id}),project.inputs);assert.ok(projects.some(row=>row.id===project.id));}
});
