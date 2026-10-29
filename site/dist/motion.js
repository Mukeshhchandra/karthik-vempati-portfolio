(() => {
  'use strict';
  const reduced=matchMedia('(prefers-reduced-motion: reduce)'), fine=matchMedia('(hover: hover) and (pointer: fine)'), compact=matchMedia('(max-width:760px), (max-height:650px)');
  let paused=false;try{paused=sessionStorage.getItem('portfolio-motion')==='off';}catch{}
  const enabled=()=>!paused&&!reduced.matches;
  const button=document.querySelector('.global-motion');
  const jobs=[];
  const sync=()=>{
    document.documentElement.dataset.motion=enabled()?'on':'off';
    button.setAttribute('aria-pressed',String(!enabled()));button.disabled=reduced.matches;
    button.textContent=enabled()?'Motion on Ⅱ':reduced.matches?'Reduced motion':'Motion off ▷';
    button.title=enabled()?'Pause decorative motion':'Resume decorative motion';
    document.dispatchEvent(new Event('motionchange'));jobs.forEach(job=>job.wake());
  };
  button.addEventListener('click',()=>{paused=!paused;try{sessionStorage.setItem('portfolio-motion',paused?'off':'on');}catch{}sync();});
  reduced.addEventListener('change',sync);sync();
  addEventListener('pageswap',e=>{if(!enabled())e.viewTransition?.skipTransition();});
  addEventListener('pagereveal',e=>{if(!enabled())e.viewTransition?.skipTransition();});
  document.addEventListener('click',e=>{
    const link=e.target.closest('.project-card a');if(!link||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
    const image=link.querySelector('.project-art img');if(image&&enabled())image.style.viewTransitionName='project-cover';
  });
  addEventListener('pageshow',()=>document.querySelectorAll('.project-card img').forEach(image=>image.style.removeProperty('view-transition-name')));

  document.querySelectorAll('.project-art,.toolkit-card').forEach(surface=>{
    let frame=0,point=null;
    const reset=()=>{cancelAnimationFrame(frame);frame=0;surface.style.removeProperty('--tilt-x');surface.style.removeProperty('--tilt-y');surface.classList.remove('is-tilting');};
    surface.addEventListener('pointermove',e=>{
      if(!enabled()||!fine.matches)return;point=[e.clientX,e.clientY];if(frame)return;
      frame=requestAnimationFrame(()=>{frame=0;const r=surface.getBoundingClientRect(),x=(point[0]-r.left)/r.width-.5,y=(point[1]-r.top)/r.height-.5;
        surface.style.setProperty('--tilt-x',`${-y*6}deg`);surface.style.setProperty('--tilt-y',`${x*8}deg`);surface.style.setProperty('--shine-x',`${(x+.5)*100}%`);surface.style.setProperty('--shine-y',`${(y+.5)*100}%`);surface.classList.add('is-tilting');});
    });surface.addEventListener('pointerleave',reset);document.addEventListener('motionchange',reset);
  });

  const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
  function programFor(canvas,vertex,fragment){
    const gl=canvas.getContext('webgl',{alpha:true,antialias:true,powerPreference:'low-power'});if(!gl)return null;
    const compile=(type,text)=>{const shader=gl.createShader(type);gl.shaderSource(shader,text);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))throw Error('Shader not supported');return shader;};
    try{const p=gl.createProgram();gl.attachShader(p,compile(gl.VERTEX_SHADER,vertex));gl.attachShader(p,compile(gl.FRAGMENT_SHADER,fragment));gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS))return null;gl.useProgram(p);return{gl,p};}catch{return null;}
  }
  function track(canvas,draw,continuous=false){
    let visible=false,raf=0,last=0,lost=false;
    const frame=now=>{raf=0;if(!visible||document.hidden||lost){last=0;return;}const dt=Math.min((now-last||16)/1000,.05);if(!continuous||now-last>30||!last){const moving=draw(dt);last=now;if((continuous&&enabled())||moving)raf=requestAnimationFrame(frame);}else raf=requestAnimationFrame(frame);};
    const wake=()=>{if(!raf&&!lost)raf=requestAnimationFrame(frame);};
    new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)wake();},{rootMargin:'60px'}).observe(canvas);
    addEventListener('resize',wake);document.addEventListener('visibilitychange',wake);document.addEventListener('motionchange',wake);
    canvas.addEventListener('webglcontextlost',()=>{lost=true;cancelAnimationFrame(raf);canvas.style.visibility='hidden';canvas.closest('.work-stage')?.classList.remove('has-webgl');});
    jobs.push({wake});return wake;
  }
  function fit(canvas,gl,maxDpr=1.35){const dpr=Math.min(devicePixelRatio||1,maxDpr),w=Math.max(1,Math.round(canvas.clientWidth*dpr)),h=Math.max(1,Math.round(canvas.clientHeight*dpr));if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;gl.viewport(0,0,w,h);}return w/h;}
  const section=document.querySelector('.work-stage');
  if(section){
    const items=JSON.parse(section.dataset.projects);let active=0,current=0,phase=0,targetPhase=0,lastSwipe=0;
    try{const saved=Number(sessionStorage.getItem('portfolio-project'));if(Number.isInteger(saved)&&saved>=0&&saved<items.length)active=saved;}catch{}current=active;
    const canvas=section.querySelector('.ribbon-canvas'),fallback=section.querySelector('.ribbon-fallback img'),hit=section.querySelector('.gallery-hit');let wake=()=>{};
    const selected=()=>((active%items.length)+items.length)%items.length;
    const update=()=>{const index=selected(),item=items[index];section.querySelector('.stage-count').textContent=`${String(index+1).padStart(2,'0')} / 06`;section.querySelector('.stage-title').textContent=item.title;section.querySelector('.stage-subtitle').textContent=item.subtitle;section.querySelector('.stage-link').href=item.href;hit.href=item.href;hit.setAttribute('aria-label',`Open ${item.title} case study`);fallback.src=item.src;fallback.alt=item.title+' design project';try{sessionStorage.setItem('portfolio-project',String(index));}catch{}wake();};
    const step=amount=>{active+=amount;if(!enabled())current=active;update();};
    section.querySelector('.stage-prev').addEventListener('click',()=>step(-1));section.querySelector('.stage-next').addEventListener('click',()=>step(1));
    section.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();step(e.key==='ArrowRight'?1:-1);}});
    let touch;const viewport=section.querySelector('.ribbon-viewport');viewport.addEventListener('touchstart',e=>{touch=[e.touches[0].clientX,e.touches[0].clientY];},{passive:true});viewport.addEventListener('touchend',e=>{if(!touch)return;const dx=e.changedTouches[0].clientX-touch[0],dy=e.changedTouches[0].clientY-touch[1];if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy)*1.5){lastSwipe=performance.now();step(dx<0?1:-1);}touch=null;},{passive:true});hit.addEventListener('click',e=>{if(performance.now()-lastSwipe<400)e.preventDefault();});
    update();
    const vertex=`attribute vec2 point;varying vec2 uv;varying float depth;uniform float offset;uniform float aspect;uniform float phase;uniform float index;uniform float active;uniform float mobile;
      void main(){uv=point+.5;float q=point.x*3.7+offset*3.9;
        vec3 ribbon=vec3(q,point.y*2.35+.22*cos(q*.85),-.095*q*q+.18*cos(q));
        float theta=(index-active)*1.04719755+1.5707963;
        float a=theta-1.5707963;vec2 local=point*vec2(1.48,.94);mat2 rot=mat2(cos(a),sin(a),-sin(a),cos(a));
        vec3 ring=vec3(vec2(cos(theta)*2.7,sin(theta)*1.6)+rot*local,-.9+cos(theta)*.3);
        vec3 stack=vec3(point.x*3.7+offset*.13,point.y*2.35-offset*.38,-abs(offset)*.8);
        float t=smoothstep(0.,1.,phase),s=smoothstep(1.,2.,phase);vec3 pos=mix(mix(ribbon,ring,t),stack,s);
        depth=pos.z;pos.z-=6.4;float zoom=mix(mix(4.05,3.,sin(clamp(phase,0.,2.)*1.5707963)),2.8,mobile);gl_Position=vec4(pos.x*zoom/aspect,pos.y*zoom,-1.02*pos.z-.202,-pos.z);
      }`;
    const fragment=`precision mediump float;varying vec2 uv;varying float depth;uniform sampler2D art;uniform float imageAspect;uniform float fade;
      void main(){vec2 p=abs(uv-.5)-vec2(.488,.482);if(length(max(p,0.))>.015)discard;
        vec2 st=uv;float card=1.574;if(imageAspect>card)st.x=(st.x-.5)*card/imageAspect+.5;else st.y=(st.y-.5)*imageAspect/card+.5;
        vec3 color=texture2D(art,vec2(st.x,1.-st.y)).rgb;
        float light=clamp(1.+depth*.045,.65,1.);gl_FragColor=vec4(color*light,fade);
      }`;
    const context=programFor(canvas,vertex,fragment);
    if(context){const{gl,p}=context;const vertices=[],indices=[],nx=48,ny=8;
      for(let y=0;y<=ny;y++)for(let x=0;x<=nx;x++){vertices.push(x/nx-.5,y/ny-.5);if(x<nx&&y<ny){const i=y*(nx+1)+x;indices.push(i,i+1,i+nx+1,i+1,i+nx+2,i+nx+1);}}
      gl.bindBuffer(gl.ARRAY_BUFFER,gl.createBuffer());gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(vertices),gl.STATIC_DRAW);const attribute=gl.getAttribLocation(p,'point');gl.enableVertexAttribArray(attribute);gl.vertexAttribPointer(attribute,2,gl.FLOAT,false,0,0);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,gl.createBuffer());gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(indices),gl.STATIC_DRAW);
      gl.enable(gl.DEPTH_TEST);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.clearColor(0,0,0,0);
      const u=Object.fromEntries(['offset','aspect','phase','index','active','mobile','art','imageAspect','fade'].map(key=>[key,gl.getUniformLocation(p,key)]));
      Promise.all(items.map(item=>new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>{const tex=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,tex);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,image);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);resolve({tex,aspect:image.naturalWidth/image.naturalHeight});};image.onerror=reject;image.src=item.src;}))).then(textures=>{
        section.classList.add('has-webgl');canvas.dataset.renderer='curved-mesh-webgl';
        const progress=()=>{const r=section.getBoundingClientRect();const top=innerWidth<=600?64:76;let fraction=enabled()&&!compact.matches?clamp((top-r.top)/Math.max(1,r.height-innerHeight+top)):0;targetPhase=fraction*2;section.style.setProperty('--scene-progress',fraction);section.style.setProperty('--orbit-presence',String(clamp(1-Math.abs(fraction-.5)*7)));section.querySelector('.scene-label').textContent=fraction<.23?'Scroll to change perspective':fraction<.72?'Six ideas. One orbit.':'One project. Up close.';const ring=fraction>.28&&fraction<.72;hit.style.pointerEvents=ring?'none':'';hit.tabIndex=ring?-1:0;hit.setAttribute('aria-hidden',String(ring));wake();};
        wake=track(canvas,dt=>{const ease=1-Math.exp(-dt*10);current=enabled()?current+(active-current)*ease:active;phase=enabled()?phase+(targetPhase-phase)*ease:0;gl.uniform1f(u.aspect,fit(canvas,gl));gl.uniform1f(u.phase,phase);gl.uniform1f(u.active,current);gl.uniform1f(u.mobile,compact.matches?1:0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
          const drawOrder=textures.map((texture,index)=>{let offset=((index-current+3)%6+6)%6-3;return{...texture,index,offset};}).sort((a,b)=>Math.abs(b.offset)-Math.abs(a.offset));
          drawOrder.forEach(item=>{gl.uniform1f(u.offset,item.offset);gl.uniform1f(u.index,item.index);gl.uniform1f(u.imageAspect,item.aspect);gl.uniform1f(u.fade,1);gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,item.tex);gl.uniform1i(u.art,0);gl.drawElements(gl.TRIANGLES,indices.length,gl.UNSIGNED_SHORT,0);});return Math.abs(current-active)>.001||Math.abs(phase-targetPhase)>.001;});
        addEventListener('scroll',progress,{passive:true});addEventListener('resize',progress);document.addEventListener('motionchange',progress);progress();update();
      }).catch(()=>{canvas.style.display='none';});
    }
  }
})();
