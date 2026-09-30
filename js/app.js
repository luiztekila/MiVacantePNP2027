let preguntas = [];
let indice = 0;
let seleccion = null;
let respondida = false;
let buenas = 0;
let malas = 0;
let nombreTemaActual = "";
let preguntasMalas = [];
let modoRepaso = false;

const $ = id => document.getElementById(id);

function mezclar(arr){
  const copia = [...arr];
  for(let i=copia.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [copia[i],copia[j]]=[copia[j],copia[i]];
  }
  return copia;
}

function limpiarTexto(s){
  return s.replace(/\r/g,"").trim();
}

function parsearBanco(texto){
  const bloques = limpiarTexto(texto).split(/\n\s*\n/);
  const resultado = [];

  for(const bloque of bloques){
    const lineas = bloque.split("\n").map(x=>x.trim()).filter(Boolean);
    if(lineas.length < 7) continue;

    const pregunta = lineas[0].replace(/^\d+\.\s*/, "");
    const alternativas = {};
    for(let i=1;i<=5;i++){
      const m=lineas[i].match(/^([a-eA-E])\)\s*(.*)$/);
      if(m) alternativas[m[1].toLowerCase()] = m[2].trim();
    }

    const resp = bloque.match(/\(Respuesta:\s*([a-eA-E])\)/i);
    if(!resp) continue;

    const respuesta = resp[1].toLowerCase();
    if(Object.keys(alternativas).length===5){
      resultado.push({pregunta, alternativas, respuesta});
    }
  }
  return resultado;
}

function cargarTemas(){
  const cont=$("listaTemas");
  cont.innerHTML="";
  for(const nombre of Object.keys(BANCOS)){
    const total=parsearBanco(BANCOS[nombre]).length;
    const btn=document.createElement("button");
    btn.className="tema-btn";
    btn.innerHTML=`<strong>${nombre}</strong><small>${total} preguntas disponibles</small>`;
    btn.onclick=()=>iniciarExamen(nombre);
    cont.appendChild(btn);
  }
}

function iniciarExamen(nombre){
  nombreTemaActual=nombre;
  const banco=parsearBanco(BANCOS[nombre]);
  const cantidad=$("cantidad").value;
  let n=cantidad==="todas"?banco.length:Math.min(Number(cantidad),banco.length);

  preguntas=mezclar(banco).slice(0,n);
  indice=0; buenas=0; malas=0; preguntasMalas=[];
  modoRepaso=false;
  $("pantallaTemas").classList.add("oculto");
  $("pantallaResultado").classList.add("oculto");
  $("pantallaExamen").classList.remove("oculto");
  $("btnRepasarMalas").classList.add("oculto");
  mostrarPregunta();
}

function mostrarPregunta(){
  if(!preguntas.length)return;
  const p=preguntas[indice];
  seleccion=null; respondida=false;

  $("nombreTema").textContent=modoRepaso?"REPASO DE MALAS":nombreTemaActual;
  $("tituloPregunta").textContent=p.pregunta;
  $("numeroPregunta").textContent=indice+1;
  $("totalPreguntas").textContent=preguntas.length;
  $("buenas").textContent=buenas;
  $("malas").textContent=malas;
  $("barraProgreso").style.width=((indice+1)/preguntas.length*100)+"%";
  $("mensajeRespuesta").className="mensaje oculto";
  $("mensajeRespuesta").textContent="";

  const cont=$("alternativas"); cont.innerHTML="";
  for(const letra of ["a","b","c","d","e"]){
    const div=document.createElement("div");
    div.className="alternativa";
    div.dataset.letra=letra;
    div.innerHTML=`<b>${letra})</b> ${p.alternativas[letra]}`;
    div.onclick=()=>seleccionar(letra);
    cont.appendChild(div);
  }

  $("btnAnterior").disabled=indice===0;
  $("btnSiguiente").disabled=!respondida;
}

function seleccionar(letra){
  if(respondida)return;
  seleccion=letra;
  document.querySelectorAll(".alternativa").forEach(x=>x.classList.remove("seleccionada"));
  document.querySelector(`[data-letra="${letra}"]`).classList.add("seleccionada");
}

function responder(){
  if(respondida)return;
  if(!seleccion){alert("Selecciona una alternativa.");return;}

  const p=preguntas[indice];
  respondida=true;

  document.querySelectorAll(".alternativa").forEach(x=>{
    const letra=x.dataset.letra;
    if(letra===p.respuesta)x.classList.add("correcta");
    if(letra===seleccion && seleccion!==p.respuesta)x.classList.add("incorrecta");
  });

  const msg=$("mensajeRespuesta");
  if(seleccion===p.respuesta){
    buenas++;
    msg.textContent="✓ Respuesta correcta";
    msg.className="mensaje ok";
  }else{
    malas++;
    preguntasMalas.push(p);
    msg.textContent=`✗ Respuesta incorrecta. La respuesta es: ${p.respuesta.toUpperCase()}) ${p.alternativas[p.respuesta]}`;
    msg.className="mensaje error";
  }

  $("buenas").textContent=buenas;
  $("malas").textContent=malas;
  $("btnSiguiente").disabled=false;
  if(indice===preguntas.length-1)$("btnRepasarMalas").classList.toggle("oculto",preguntasMalas.length===0);
}

function siguiente(){
  if(!respondida)return;
  if(indice<preguntas.length-1){indice++;mostrarPregunta();}
  else finalizar();
}

function anterior(){
  if(indice>0){indice--;mostrarPregunta();}
}

function verRespuesta(){
  const p=preguntas[indice];
  const msg=$("mensajeRespuesta");
  msg.textContent=`Respuesta correcta: ${p.respuesta.toUpperCase()}) ${p.alternativas[p.respuesta]}`;
  msg.className="mensaje ok";
}

function finalizar(){
  $("pantallaExamen").classList.add("oculto");
  $("pantallaResultado").classList.remove("oculto");

  const total=preguntas.length;
  const porcentaje=total?Math.round(buenas/total*100):0;
  $("porcentaje").textContent=porcentaje+"%";
  $("resBuenas").textContent=buenas;
  $("resMalas").textContent=malas;
  $("resTotal").textContent=total;
  $("resumenResultado").textContent=`Has terminado el tema ${nombreTemaActual}.`;
}

function repasarMalas(){
  const unicas=[...new Map(preguntasMalas.map(p=>[p.pregunta,p])).values()];
  if(!unicas.length){alert("No tienes preguntas incorrectas para repasar.");return;}
  preguntas=mezclar(unicas);
  indice=0;
  buenas=0; malas=0;
  modoRepaso=true;
  $("pantallaResultado").classList.add("oculto");
  $("pantallaExamen").classList.remove("oculto");
  mostrarPregunta();
}

$("btnResponder").onclick=responder;
$("btnSiguiente").onclick=siguiente;
$("btnAnterior").onclick=anterior;
$("btnVerRespuesta").onclick=verRespuesta;
$("btnRepasarMalas").onclick=repasarMalas;
$("btnFinalizar").onclick=finalizar;

$("btnNuevoExamen").onclick=()=>iniciarExamen(nombreTemaActual);
$("btnVolverTemas").onclick=()=>{
  $("pantallaResultado").classList.add("oculto");
  $("pantallaTemas").classList.remove("oculto");
};

cargarTemas();
