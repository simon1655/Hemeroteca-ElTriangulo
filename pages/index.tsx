import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { useState } from 'react';

interface Noticia {
  id: number;
  titulo: string;
  slug: string;
  fecha: string;
  categorias: string;
  autor: string;
}

const CATEGORIAS = [
  'Política', 'Economía', 'Sociedad', 'Cultura y Espectáculos',
  'Deportes', 'Sucesos', 'Educación', 'Medio ambiente',
  'Fiestas', 'Turismo', 'Empleo', 'Opinión'
];

const MESES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
const ANOS = Array.from({ length: 2025 - 2010 + 1 }, (_, i) => 2025 - i);
const azul = '#1a3a6b';
const naranja = '#f5a623';

function formatearFecha(fechaStr: string): string {
  const [fecha] = fechaStr.split(' ');
  const [año, mes, dia] = fecha.split('-');
  return `${parseInt(dia)} de ${MESES[parseInt(mes)-1]} de ${año}`;
}

const selectStyle = {
  padding: '10px 16px',
  border: '1.5px solid #dde3ed',
  borderRadius: 6,
  fontSize: 14,
  color: '#333',
  background: '#fff',
  cursor: 'pointer',
  outline: 'none',
  appearance: 'none' as const,
  WebkitAppearance: 'none' as const,
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%231a3a6b' d='M1 1l5 5 5-5'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat' as const,
  backgroundPosition: 'right 12px center',
  paddingRight: 36,
};

export default function Home({ noticias, total }: { noticias: Noticia[], total: number }) {
  const [busqueda, setBusqueda] = useState('');
  const [categoria, setCategoria] = useState('');
  const [ano, setAno] = useState('');
  const [pagina, setPagina] = useState(1);

  const filtradas = noticias.filter(n => {
    const matchBusqueda = busqueda === '' || n.titulo.toLowerCase().includes(busqueda.toLowerCase());
    const matchCategoria = categoria === '' || (n.categorias && n.categorias.includes(categoria));
    const matchAno = ano === '' || n.fecha.startsWith(ano);
    return matchBusqueda && matchCategoria && matchAno;
  });

  const POR_PAGINA = 18;
  const totalPaginas = Math.ceil(filtradas.length / POR_PAGINA);
  const noticiasPagina = filtradas.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA);

  const handleFiltro = (setter: (v: string) => void, valor: string) => {
    setter(valor);
    setPagina(1);
  };

  return (
    <div style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", background: '#f7f9fc', minHeight: '100vh' }}>

      {/* HEADER */}
      <header style={{ background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
        <div style={{ maxWidth: 1140, margin: '0 auto', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' as const, gap: 12 }}>
          <div>
            <img src="/logo.png" alt="El Triángulo" style={{ height: 60, width: 'auto' }} />
            <div style={{ fontSize: 11, color: '#999', letterSpacing: 1.5, marginTop: 3, textTransform: 'uppercase' as const }}>
              Espadán · Mijares · Onda
            </div>
          </div>
          <div style={{ textAlign: 'right' as const }}>
            <div style={{ background: azul, color: '#fff', fontSize: 11, fontWeight: 700, padding: '6px 16px', borderRadius: 4, letterSpacing: 0.8, display: 'inline-block' }}>
              HEMEROTECA — ARCHIVO HISTÓRICO
            </div>            
          </div>
        </div>
      </header>

      {/* AVISO */}
      <div style={{ background: '#fffbee', borderBottom: '1px solid #fde68a', padding: '11px 24px', textAlign: 'center' as const }}>
        <span style={{ fontSize: 13, color: '#78600a' }}>
           Estás navegando por el archivo histórico de El Triángulo. Para noticias actuales visita{' '}.
          <a href="https://www.eltriangulo.es" style={{ color: azul, fontWeight: 700, textDecoration: 'none' }}>eltriangulo.es</a>
        </span>
      </div>

      {/* BUSCADOR */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e8ecf2', padding: '18px 24px' }}>
        <div style={{ maxWidth: 1140, margin: '0 auto', display: 'flex', gap: 10, flexWrap: 'wrap' as const, alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: 220, position: 'relative' as const }}>
            <span style={{ position: 'absolute' as const, left: 14, top: '50%', transform: 'translateY(-50%)', color: '#aaa', fontSize: 15 }}></span>
            <input
              type="text"
              placeholder="Buscar noticia..."
              value={busqueda}
              onChange={e => handleFiltro(setBusqueda, e.target.value)}
              style={{ width: '100%', padding: '10px 14px 10px 38px', border: '1.5px solid #dde3ed', borderRadius: 6, fontSize: 14, color: '#333', background: '#fff', outline: 'none', boxSizing: 'border-box' as const }}
            />
          </div>
          <select value={categoria} onChange={e => handleFiltro(setCategoria, e.target.value)} style={selectStyle}>
            <option value="">Todas las categorías</option>
            {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={ano} onChange={e => handleFiltro(setAno, e.target.value)} style={selectStyle}>
            <option value="">Todos los años</option>
            {ANOS.map(a => <option key={a} value={String(a)}>{a}</option>)}
          </select>
          {(busqueda || categoria || ano) && (
            <button
              onClick={() => { handleFiltro(setBusqueda, ''); setCategoria(''); setAno(''); }}
              style={{ padding: '10px 16px', border: '1.5px solid #dde3ed', borderRadius: 6, fontSize: 13, color: '#666', background: '#fff', cursor: 'pointer' }}
            >
              ✕ Limpiar
            </button>
          )}
        </div>
        {(busqueda || categoria || ano) && (
          <div style={{ maxWidth: 1140, margin: '10px auto 0', fontSize: 13, color: '#888' }}>
            {filtradas.length} resultado{filtradas.length !== 1 ? 's' : ''} encontrado{filtradas.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* NOTICIAS */}
      <div style={{ maxWidth: 1140, margin: '0 auto', padding: '32px 24px' }}>
        <h2 style={{ fontSize: 13, fontWeight: 700, color: azul, textTransform: 'uppercase' as const, letterSpacing: 2, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ display: 'inline-block', width: 28, height: 3, background: naranja, borderRadius: 2 }}></span>
          {busqueda || categoria || ano ? 'Resultados de búsqueda' : 'Últimas noticias'}
        </h2>

        {noticiasPagina.length === 0 ? (
          <div style={{ textAlign: 'center' as const, padding: '80px 20px', color: '#bbb' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}></div>
            <div style={{ fontSize: 17, color: '#888' }}>No se encontraron noticias con esos filtros</div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: 20 }}>
            {noticiasPagina.map(n => {
              const cat = n.categorias ? n.categorias.split('|')[0] : '';
              const [fechaParte] = n.fecha.split(' ');
              const [añoN, mesN, diaN] = fechaParte.split('-');
              return (
                <Link key={n.id} href={`/${añoN}/${mesN}/${n.slug}`} style={{ textDecoration: 'none' }}>
                  <div
                    style={{ background: '#fff', borderRadius: 8, padding: '20px 22px', boxShadow: '0 1px 3px rgba(0,0,0,0.07)', border: '1px solid #eef1f6', cursor: 'pointer', transition: 'all 0.18s', height: '100%', display: 'flex', flexDirection: 'column' as const, justifyContent: 'space-between' }}
                    onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 20px rgba(26,58,107,0.12)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.07)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                  >
                    <div>
                      {cat && (
                        <span style={{ fontSize: 10, fontWeight: 700, color: azul, background: '#eef2fa', padding: '3px 10px', borderRadius: 3, textTransform: 'uppercase' as const, letterSpacing: 1, display: 'inline-block', marginBottom: 12 }}>
                          {cat}
                        </span>
                      )}
                      <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111', lineHeight: 1.45, margin: '0 0 14px' }}>
                        {n.titulo.replace(/\\'/g, "'")}
                      </h3>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
                      <span style={{ fontSize: 12, color: '#aaa' }}>
                        {`${parseInt(diaN)} ${MESES[parseInt(mesN)-1].slice(0,3)}. ${añoN}`}
                      </span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: naranja }}>
                        Leer más →
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* PAGINACIÓN */}
        {totalPaginas > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6, marginTop: 48, flexWrap: 'wrap' as const }}>
            <button
              onClick={() => setPagina(p => Math.max(1, p - 1))}
              disabled={pagina === 1}
              style={{ padding: '8px 18px', border: '1.5px solid #dde3ed', borderRadius: 6, background: '#fff', cursor: pagina === 1 ? 'not-allowed' : 'pointer', color: pagina === 1 ? '#ccc' : azul, fontWeight: 700, fontSize: 13 }}
            >
              ← Anterior
            </button>
            {Array.from({ length: Math.min(5, totalPaginas) }, (_, i) => {
              const p = Math.max(1, Math.min(pagina - 2, totalPaginas - 4)) + i;
              return (
                <button
                  key={p}
                  onClick={() => setPagina(p)}
                  style={{ padding: '8px 14px', border: `1.5px solid ${p === pagina ? azul : '#dde3ed'}`, borderRadius: 6, background: p === pagina ? azul : '#fff', color: p === pagina ? '#fff' : '#555', fontWeight: p === pagina ? 700 : 400, fontSize: 13, cursor: 'pointer' }}
                >
                  {p}
                </button>
              );
            })}
            <button
              onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))}
              disabled={pagina === totalPaginas}
              style={{ padding: '8px 18px', border: '1.5px solid #dde3ed', borderRadius: 6, background: '#fff', cursor: pagina === totalPaginas ? 'not-allowed' : 'pointer', color: pagina === totalPaginas ? '#ccc' : azul, fontWeight: 700, fontSize: 13 }}
            >
              Siguiente →
            </button>
            <span style={{ fontSize: 12, color: '#aaa', marginLeft: 6 }}>
              Página {pagina} de {totalPaginas}
            </span>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer style={{ background: '#ffb22a', color: '#fff', padding: '32px 24px', marginTop: 20 }}>
        <div style={{ maxWidth: 1140, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' as const, gap: 16 }}>
          <div>
            <img src="/logo2.png" alt="El Triángulo" style={{ height: 60, width: 'auto' }} />
            <div style={{ fontSize: 12, color: '#ffffff', marginTop: 6 }}>Hemeroteca histórica · 2010–2025</div>
          </div>
          <div style={{ fontSize: 13, color: '#ffffff', textAlign: 'right' as const }}>
            <a href="https://www.eltriangulo.es" style={{ color: #ffffff, fontWeight: 700, textDecoration: 'none' }}>Ir al sitio actual →</a>
            <div style={{ marginTop: 6 }}>© El Triángulo. Todos los derechos reservados.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export async function getStaticProps() {
  const indice = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data/indice.json'), 'utf-8'));
  return {
    props: {
      noticias: indice,
      total: indice.length
    }
  };
}
