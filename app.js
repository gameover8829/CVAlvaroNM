console.log("JS cargado correctamente");
// ===== Config =====
const STORAGE_KEY = "asabor_config_v1";
const WHATSAPP_NUMERO_KEY = "asabor_whatsapp_v1";

// Cambia este número por el real (formato: 52 + 10 dígitos, sin + ni espacios)
const DEFAULT_WHATSAPP = "52TU_NUMERO_AQUI";

// Admin PIN
const ADMIN_PIN_KEY = "asabor_admin_pin_v1";
const ADMIN_SESSION_KEY = "asabor_admin_session_v1";
// Cambia el PIN por defecto
const DEFAULT_ADMIN_PIN = "1234";

// Ruta oculta del admin
const ADMIN_HIDDEN_PAGE = "panel-cocinera-9x3k.html";

// ===== Datos por defecto =====
const DEFAULT_DATA = {
  negocio: {
    nombre: "Al Sabor de Mi Tierra",
    ubicacion: "Zacatlán, Puebla",
    direccion: "(pon aquí tu dirección)",
    descripcion: "Comida casera con platillos del día de lunes a domingo."
  },
  horarios: {
    Lunes:   { abre: "08:00", cierra: "18:00", cerrado: false },
    Martes:  { abre: "08:00", cierra: "18:00", cerrado: false },
    Miércoles:{ abre: "08:00", cierra: "18:00", cerrado: false },
    Jueves:  { abre: "08:00", cierra: "18:00", cerrado: false },
    Viernes: { abre: "08:00", cierra: "18:00", cerrado: false },
    Sábado:  { abre: "09:00", cierra: "17:00", cerrado: false },
    Domingo: { abre: "09:00", cierra: "16:00", cerrado: false }
  },
  menu: {
    Lunes: [
      { nombre: "Mole poblano con pollo", descripcion: "Arroz + tortillas", precio: 90 },
      { nombre: "Sopa del día", descripcion: "Pregunta por la disponible", precio: 35 }
    ],
    Martes: [
      { nombre: "Tinga de pollo", descripcion: "Con tostadas o tortillas", precio: 80 },
      { nombre: "Agua del día", descripcion: "Vaso", precio: 25 }
    ],
    Miércoles: [
      { nombre: "Enchiladas verdes", descripcion: "Pollo + crema + queso", precio: 85 },
      { nombre: "Postre casero", descripcion: "Según disponibilidad", precio: 30 }
    ],
    Jueves: [
      { nombre: "Chiles rellenos", descripcion: "Arroz + frijoles", precio: 95 },
      { nombre: "Café de olla", descripcion: "Taza", precio: 20 }
    ],
    Viernes: [
      { nombre: "Pescado a la mexicana", descripcion: "Ensalada + arroz", precio: 110 },
      { nombre: "Tortillas extra", descripcion: "Paquete", precio: 10 }
    ],
    Sábado: [
      { nombre: "Pozole rojo", descripcion: "Incluye tostadas y complementos", precio: 120 },
      { nombre: "Refresco", descripcion: "Lata", precio: 25 }
    ],
    Domingo: [
      { nombre: "Barbacoa", descripcion: "Consomé + tortillas", precio: 140 },
      { nombre: "Arroz extra", descripcion: "Porción", precio: 20 }
    ]
  }
};

// ===== Helpers =====
function loadData(){
  const raw = localStorage.getItem(STORAGE_KEY);
  if(!raw){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_DATA));
    return JSON.parse(JSON.stringify(DEFAULT_DATA));
  }
  try { return JSON.parse(raw); }
  catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_DATA));
    return structuredClone(DEFAULT_DATA);
  }
}
function saveData(data){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
function getWhatsapp(){
  return localStorage.getItem(WHATSAPP_NUMERO_KEY) || DEFAULT_WHATSAPP;
}
function setWhatsapp(num){
  localStorage.setItem(WHATSAPP_NUMERO_KEY, num);
}
function getAdminPin(){
  return localStorage.getItem(ADMIN_PIN_KEY) || DEFAULT_ADMIN_PIN;
}
function setAdminPin(pin){
  localStorage.setItem(ADMIN_PIN_KEY, pin);
}
function isAdminLogged(){
  return localStorage.getItem(ADMIN_SESSION_KEY) === "1";
}
function setAdminLogged(v){
  localStorage.setItem(ADMIN_SESSION_KEY, v ? "1" : "0");
}
function money(n){ return "$" + Number(n).toFixed(0); }
function todaySpanish(){
  const days = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];
  return days[new Date().getDay()];
}
function tomorrowSpanish(){
  const days = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];
  return days[(new Date().getDay() + 1) % 7];
}
function isTodayOrTomorrow(day){
  const t = todaySpanish();
  const tm = tomorrowSpanish();
  return day === t || day === tm;
}
function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}

// ===== Render: Header (admin oculto) =====
function renderHeader(active){
  const data = loadData();
  const header = document.querySelector("header");
  if(!header) return;

  const isAdminPage = active === "admin"; // solo si estás en el panel oculto

  header.innerHTML = `
    <div class="brand">
      <div class="logo">MT</div>
      <div>
        <div style="font-weight:900">${escapeHtml(data.negocio.nombre)}</div>
        <div class="muted" style="font-size:13px">${escapeHtml(data.negocio.ubicacion)}</div>
      </div>
    </div>

    <nav>
      <a class="chip" href="index.html" ${active==="inicio"?'style="border-color:rgba(255,255,255,.35)"':''}>Inicio</a>
      <a class="chip" href="menu.html" ${active==="menu"?'style="border-color:rgba(255,255,255,.35)"':''}>Menú</a>
      <a class="chip" href="pedido.html" ${active==="pedido"?'style="border-color:rgba(255,255,255,.35)"':''}>Pedido</a>
      ${isAdminPage ? `<a class="chip" href="${ADMIN_HIDDEN_PAGE}" style="border-color:rgba(255,255,255,.35)">Admin</a>` : ``}
    </nav>
  `;
}

// ===== Página: Inicio =====
function renderIndexPage(){
  const data = loadData();
  const info = document.getElementById("infoNegocio");
  const horas = document.getElementById("tablaHorarios");
  if(info){
    info.innerHTML = `
      <h2>${escapeHtml(data.negocio.nombre)}</h2>
      <p class="muted">${escapeHtml(data.negocio.descripcion)}</p>
      <div class="badge">📍 <b>Dirección:</b> ${escapeHtml(data.negocio.direccion)}</div>
      <div class="badge" style="margin-top:10px">📌 <b>Ubicación:</b> ${escapeHtml(data.negocio.ubicacion)}</div>
    `;
  }
  if(horas){
    const days = Object.keys(data.horarios);
    horas.innerHTML = `
      <table>
        <thead><tr><th>Día</th><th>Estado</th></tr></thead>
        <tbody>
          ${days.map(d=>{
            const h = data.horarios[d];
            const estado = h.cerrado ? "<b>CERRADO</b>" : `${h.abre}–${h.cierra}`;
            return `<tr><td><b>${d}</b></td><td>${estado}</td></tr>`;
          }).join("")}
        </tbody>
      </table>
    `;
  }
}

// ===== Página: Menú (solo HOY y MAÑANA + cerrado gigante) =====
function renderMenuPage(){
  const data = loadData();
  const hoyDia = todaySpanish();
  const mananaDia = tomorrowSpanish();

  const cont = document.getElementById("menuContainer");
  const status = document.getElementById("statusHoy");
  const toggleWrap = document.getElementById("toggleSemana");
  if(!cont) return;

  let showAll = false;

  function render(){
    const days = Object.keys(data.menu).filter(d => showAll ? true : isTodayOrTomorrow(d));

    const hoy = data.horarios[hoyDia];
    if(status){
      status.innerHTML = hoy?.cerrado
        ? `<div class="big-closed">HOY (${hoyDia}) · CERRADO</div>`
        : `<div class="big-open">HOY (${hoyDia}) · Abierto ${hoy.abre}–${hoy.cierra}</div>`;
    }

    cont.innerHTML = days.map(d=>{
      const h = data.horarios[d];
      const items = data.menu[d] || [];
      const tag = d === hoyDia ? `<span class="day-tag">HOY</span>` : `<span class="day-tag">MAÑANA</span>`;

      const headerEstado = h?.cerrado
        ? `<div class="big-closed">${tag} · ${d} · CERRADO</div>`
        : `<div class="big-open">${tag} · ${d} · Abierto ${h.abre}–${h.cierra}</div>`;

      return `
        <div class="card">
          <div class="menu-top">
            <h3 style="margin:0">${d}</h3>
            <div class="mini">${h?.cerrado ? "No habrá servicio" : "Selecciona y pide en WhatsApp"}</div>
          </div>

          <div style="margin-top:10px">${headerEstado}</div>

          <div style="margin-top:12px" class="grid">
            ${h?.cerrado ? `
              <div class="muted">Este día está marcado como cerrado.</div>
            ` : (
              items.map(it=>`
                <div class="item">
                  <div>
                    <div style="font-weight:800">${escapeHtml(it.nombre)}</div>
                    <small>${escapeHtml(it.descripcion || "")}</small>
                  </div>
                  <div class="price">${money(it.precio)}</div>
                  <a class="chip" href="pedido.html">Pedir</a>
                </div>
              `).join("") || `<div class="muted">Sin platillos cargados.</div>`
            )}
          </div>
        </div>
      `;
    }).join("");

    if(toggleWrap){
      toggleWrap.innerHTML = `
        <button class="pill-btn" id="btnToggle">
          ${showAll ? "Ver solo HOY y MAÑANA" : "Ver semana completa"}
        </button>
      `;
      document.getElementById("btnToggle").onclick = ()=>{
        showAll = !showAll;
        render();
      };
    }
  }

  render();
}

// ===== Página: Pedido =====
function renderPedidoPage(){
  const data = loadData();
  const daySelect = document.getElementById("diaSelect");
  const itemsWrap = document.getElementById("itemsWrap");
  const msgArea = document.getElementById("mensaje");
  const totalEl = document.getElementById("total");
  if(!daySelect || !itemsWrap) return;

  daySelect.innerHTML = Object.keys(data.menu).map(d=>`<option value="${d}">${d}</option>`).join("");

  // Por defecto HOY; si HOY está cerrado, cambia a MAÑANA
  const hoy = todaySpanish();
  const manana = tomorrowSpanish();
  if(data.horarios[hoy]?.cerrado && !data.horarios[manana]?.cerrado) daySelect.value = manana;
  else daySelect.value = hoy;

  function renderItems(){
    const d = daySelect.value;
    const h = data.horarios[d];
    const items = data.menu[d] || [];

    if(h?.cerrado){
      itemsWrap.innerHTML = `<div class="big-closed">${d} · CERRADO</div><div class="muted">Selecciona otro día.</div>`;
      buildMessage(true);
      return;
    }

    itemsWrap.innerHTML = items.map((it, idx)=>`
      <div class="item">
        <label style="display:flex;gap:10px;align-items:flex-start">
          <input type="checkbox" data-idx="${idx}">
          <div>
            <div style="font-weight:800">${escapeHtml(it.nombre)}</div>
            <small>${escapeHtml(it.descripcion || "")}</small>
          </div>
        </label>
        <div class="price">${money(it.precio)}</div>
        <input class="qty" type="number" min="1" value="1" data-qty="${idx}">
      </div>
    `).join("") || `<div class="muted">No hay platillos para este día.</div>`;

    itemsWrap.querySelectorAll('input[type="checkbox"], input[type="number"]').forEach(el=>{
      el.addEventListener("input", buildMessage);
      el.addEventListener("change", buildMessage);
    });
    buildMessage();
  }

  function buildMessage(forceEmpty=false){
    const nombre = (document.getElementById("nombre").value || "").trim();
    const direccion = (document.getElementById("direccion").value || "").trim();
    const nota = (document.getElementById("nota").value || "").trim();
    const d = daySelect.value;

    const items = data.menu[d] || [];
    let total = 0;
    let lines = [];

    if(!forceEmpty){
      itemsWrap.querySelectorAll('input[type="checkbox"][data-idx]').forEach(chk=>{
        if(chk.checked){
          const idx = Number(chk.dataset.idx);
          const qty = Math.max(1, Number(itemsWrap.querySelector(`input[data-qty="${idx}"]`)?.value || 1));
          const it = items[idx];
          total += Number(it.precio) * qty;
          lines.push(`- ${qty} x ${it.nombre} (${money(it.precio)} c/u)`);
        }
      });
    }

    let msg = `Hola, quiero hacer un pedido en *${data.negocio.nombre}*.\n\n`;
    msg += `*Día:* ${d}\n`;
    if(nombre) msg += `*Nombre:* ${nombre}\n`;
    if(direccion) msg += `*Dirección/Referencia:* ${direccion}\n`;
    if(nota) msg += `*Nota:* ${nota}\n`;
    msg += `\n*Pedido:*\n${lines.length ? lines.join("\n") : "- (Aún no selecciono platillos)"}\n`;
    msg += `\n*Total estimado:* ${money(total)}\n\nGracias.`;

    msgArea.value = msg;
    totalEl.textContent = money(total);
  }

  document.getElementById("nombre").addEventListener("input", buildMessage);
  document.getElementById("direccion").addEventListener("input", buildMessage);
  document.getElementById("nota").addEventListener("input", buildMessage);
  daySelect.addEventListener("change", renderItems);

  document.getElementById("btnEnviar").addEventListener("click", ()=>{
    buildMessage();
    const url = `https://wa.me/${getWhatsapp()}?text=${encodeURIComponent(msgArea.value)}`;
    window.open(url, "_blank");
  });

  document.getElementById("btnLimpiar").addEventListener("click", ()=>{
    itemsWrap.querySelectorAll('input[type="checkbox"]').forEach(c=>c.checked=false);
    itemsWrap.querySelectorAll('input[type="number"]').forEach(n=>n.value=1);
    buildMessage();
  });

  renderItems();
}

// ===== Página: Admin oculta + PIN + editor intuitivo =====
function renderAdminPage(){
  const data = loadData();
  const wrap = document.getElementById("adminWrap");
  if(!wrap) return;

  // Gate por PIN
  if(!isAdminLogged()){
    wrap.innerHTML = `
      <div class="card">
        <h2>Acceso Administrador</h2>
        <p class="muted">Ingresa el PIN para administrar menús y horarios.</p>
        <label class="muted">PIN</label>
        <input id="adminPinInput" type="password" placeholder="****" />
        <div style="height:12px"></div>
        <button class="btn ok" id="btnAdminLogin">Entrar</button>
        <p class="muted" style="font-size:12px;margin-top:10px">
          Si no eres personal del comedor, no necesitas entrar aquí.
        </p>
      </div>
    `;
    document.getElementById("btnAdminLogin").addEventListener("click", ()=>{
      const pin = document.getElementById("adminPinInput").value.trim();
      if(pin === getAdminPin()){
        setAdminLogged(true);
        location.reload();
      }else{
        alert("PIN incorrecto ❌");
      }
    });
    return;
  }

  const days = Object.keys(data.menu);

  wrap.innerHTML = `
    <div class="card">
      <h2>Panel Admin (Cocinera)</h2>
      <p class="muted">Aquí cambias menú, horario y días cerrados. Se guarda en este dispositivo.</p>

      <div class="grid grid-2">
        <div>
          <label class="muted">WhatsApp del negocio (52 + 10 dígitos)</label>
          <input id="wapp" type="text" value="${escapeHtml(getWhatsapp())}">
          <small>Ejemplo: 521234567890</small>
        </div>
        <div>
          <label class="muted">Dirección del negocio</label>
          <input id="direccionNegocio" type="text" value="${escapeHtml(data.negocio.direccion)}">
        </div>
      </div>

      <div style="margin-top:12px" class="grid grid-2">
        <button class="btn ok" id="btnGuardarConfig">Guardar configuración</button>
        <button class="btn secondary" id="btnLogout">Cerrar sesión</button>
      </div>

      <div style="margin-top:10px" class="grid grid-2">
        <div>
          <label class="muted">Cambiar PIN (opcional)</label>
          <input id="newPin" type="password" placeholder="Nuevo PIN (mín. 4)">
          <small>Guárdalo en un lugar seguro.</small>
        </div>
        <button class="btn secondary" id="btnSavePin" style="height:44px;align-self:end">Guardar PIN</button>
      </div>
    </div>

    <div class="card">
      <h3>Horarios y cerrado</h3>
      <table>
        <thead><tr><th>Día</th><th>Abre</th><th>Cierra</th><th>Cerrado</th></tr></thead>
        <tbody>
          ${days.map(d=>`
            <tr>
              <td><b>${d}</b></td>
              <td><input type="time" data-h-abre="${d}" value="${data.horarios[d].abre}"></td>
              <td><input type="time" data-h-cierra="${d}" value="${data.horarios[d].cierra}"></td>
              <td><input type="checkbox" data-h-cerrado="${d}" ${data.horarios[d].cerrado ? "checked":""}></td>
            </tr>
          `).join("")}
        </tbody>
      </table>
      <div style="margin-top:10px">
        <button class="btn ok" id="btnGuardarHorarios">Guardar horarios</button>
      </div>
      <div class="notice" style="margin-top:10px">
        En el Menú, si un día está cerrado, aparecerá en grande: <b>CERRADO</b>.
      </div>
    </div>

    ${days.map(d=>`
      <div class="card" data-day-card="${d}">
        <div class="menu-top">
          <h3 style="margin:0">Menú - ${d}</h3>
          <span class="day-tag">${isTodayOrTomorrow(d) ? (d===todaySpanish() ? "HOY" : "MAÑANA") : "SEMANA"}</span>
        </div>

        <div id="list-${d}" class="grid" style="margin-top:12px"></div>

        <hr>

        <div class="grid grid-2">
          <div>
            <label class="muted">Platillo</label>
            <input type="text" placeholder="Ej. Mole poblano" data-new-name="${d}">
          </div>
          <div>
            <label class="muted">Descripción</label>
            <input type="text" placeholder="Ej. Arroz + tortillas" data-new-desc="${d}">
          </div>
        </div>

        <div class="grid grid-2" style="margin-top:10px">
          <div>
            <label class="muted">Precio (solo número)</label>
            <input class="price-input" type="number" min="0" placeholder="Ej. 90" data-new-price="${d}">
          </div>
          <div style="display:flex;align-items:end;gap:10px">
            <button class="btn ok" data-add="${d}" style="width:100%">Agregar platillo</button>
          </div>
        </div>

        <div style="margin-top:10px">
          <button class="btn secondary" data-clear="${d}">Vaciar menú de ${d}</button>
        </div>
      </div>
    `).join("")}
  `;

  function renderDayList(d){
    const list = document.getElementById(`list-${d}`);
    const items = data.menu[d] || [];
    if(!list) return;

    list.innerHTML = items.map((it, idx)=>`
      <div class="admin-item">
        <div>
          <b>${escapeHtml(it.nombre)}</b><br>
          <small>${escapeHtml(it.descripcion || "")}</small>
        </div>
        <div class="muted">Precio: <b>${money(it.precio)}</b></div>
        <div>
          <input class="price-input" type="number" min="0" value="${Number(it.precio)}" data-edit-price="${d}" data-idx="${idx}">
          <small>Editar precio</small>
        </div>
        <button class="icon-btn" title="Eliminar" data-del="${d}" data-idx="${idx}">🗑️</button>
      </div>
    `).join("") || `<div class="muted">Sin platillos. Agrega uno abajo.</div>`;

    list.querySelectorAll("[data-edit-price]").forEach(inp=>{
      inp.addEventListener("change", ()=>{
        const idx = Number(inp.dataset.idx);
        data.menu[d][idx].precio = Number(inp.value || 0);
        saveData(data);
      });
    });

    list.querySelectorAll("[data-del]").forEach(btn=>{
      btn.addEventListener("click", ()=>{
        const idx = Number(btn.dataset.idx);
        data.menu[d].splice(idx, 1);
        saveData(data);
        renderDayList(d);
      });
    });
  }

  days.forEach(renderDayList);

  document.getElementById("btnGuardarConfig").addEventListener("click", ()=>{
    const w = document.getElementById("wapp").value.trim();
    const dir = document.getElementById("direccionNegocio").value.trim();
    if(w) setWhatsapp(w);
    if(dir) data.negocio.direccion = dir;
    saveData(data);
    alert("Configuración guardada ✅");
  });

  document.getElementById("btnLogout").addEventListener("click", ()=>{
    setAdminLogged(false);
    location.reload();
  });

  document.getElementById("btnSavePin").addEventListener("click", ()=>{
    const np = (document.getElementById("newPin").value || "").trim();
    if(np.length < 4){
      alert("El PIN debe tener al menos 4 caracteres.");
      return;
    }
    setAdminPin(np);
    document.getElementById("newPin").value = "";
    alert("PIN actualizado ✅");
  });

  document.getElementById("btnGuardarHorarios").addEventListener("click", ()=>{
    days.forEach(d=>{
      const abre = document.querySelector(`[data-h-abre="${d}"]`).value;
      const cierra = document.querySelector(`[data-h-cierra="${d}"]`).value;
      const cerrado = document.querySelector(`[data-h-cerrado="${d}"]`).checked;
      data.horarios[d] = { abre, cierra, cerrado };
    });
    saveData(data);
    alert("Horarios guardados ✅");
  });

  wrap.querySelectorAll("[data-add]").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const d = btn.getAttribute("data-add");
      const name = (wrap.querySelector(`[data-new-name="${d}"]`).value || "").trim();
      const desc = (wrap.querySelector(`[data-new-desc="${d}"]`).value || "").trim();
      const price = Number(wrap.querySelector(`[data-new-price="${d}"]`).value || 0);

      if(!name){
        alert("Pon el nombre del platillo.");
        return;
      }
      data.menu[d] = data.menu[d] || [];
      data.menu[d].push({ nombre: name, descripcion: desc, precio: price });
      saveData(data);

      wrap.querySelector(`[data-new-name="${d}"]`).value = "";
      wrap.querySelector(`[data-new-desc="${d}"]`).value = "";
      wrap.querySelector(`[data-new-price="${d}"]`).value = "";

      renderDayList(d);
    });
  });

  wrap.querySelectorAll("[data-clear]").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const d = btn.getAttribute("data-clear");
      if(confirm(`¿Vaciar menú de ${d}?`)){
        data.menu[d] = [];
        saveData(data);
        renderDayList(d);
      }
    });
  });
}

// ===== Boot =====
document.addEventListener("DOMContentLoaded", ()=>{
  const active = document.body.getAttribute("data-active") || "";
  renderHeader(active);

  renderIndexPage();
  renderMenuPage();
  renderPedidoPage();
  renderAdminPage();

  const y = document.getElementById("year");
  if(y) y.textContent = new Date().getFullYear();
});
