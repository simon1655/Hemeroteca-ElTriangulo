import fs from 'fs';
import path from 'path';

interface Noticia {
  ID: number;
  post_title: string;
  post_content: string;
  post_date: string;
  categorias: string;
  autor: string;
}

export default function Noticia({ noticia }: { noticia: Noticia }) {
  const [año, mes, dia] = noticia.post_date.split(' ')[0].split('-');
  const fechaFormateada = `${parseInt(dia)} de ${['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'][parseInt(mes)-1]} de ${año}`;
  const cat = noticia.categorias ? noticia.categorias.split('|')[0] : '';
  const azul = '#1a3a6b';
  const naranja = '#f5a623';

  return (
    <div style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", background: '#fff', minHeight: '100vh' }}>

      {/* HEADER */}
      <header style={{ background: '#fff', borderBottom: '1px solid #e0e0e0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <a href="/" style={{ textDecoration: 'none' }}>
            <img src="/logo.png" alt="El Triángulo" style={{ height: 60, width: 'auto' }} />
          </a>
          <div style={{ background: azul, color: '#fff', fontSize: 11, fontWeight: 'bold', padding: '5px 14px', borderRadius: 4 }}>
            HEMEROTECA — ARCHIVO HISTÓRICO
          </div>
        </div>
      </header>

      {/* AVISO */}
      <div style={{ background: '#fff8e1', borderBottom: '1px solid #ffe082', padding: '10px 20px', textAlign: 'center' as const }}>
        <span style={{ fontSize: 13, color: '#7c6000' }}>
           Esta noticia forma parte del archivo histórico de El Triángulo. Para noticias actuales visita{' '}
          <a href="https://www.eltriangulo.es" style={{ color: azul, fontWeight: 'bold' }}>eltriangulo.es</a>
        </span>
      </div>

      {/* ARTÍCULO */}
      <div style={{ maxWidth: 780, margin: '0 auto', padding: '36px 20px 60px' }}>

        <a href="/" style={{ fontSize: 13, color: azul, textDecoration: 'none', display: 'inline-block', marginBottom: 28, opacity: 0.8 }}>
          ← Volver a la hemeroteca
        </a>

        {cat && (
          <div style={{ marginBottom: 12 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: azul, textTransform: 'uppercase' as const, letterSpacing: 1.5, borderBottom: `2px solid ${naranja}`, paddingBottom: 2 }}>
              {cat}
            </span>
          </div>
        )}

        <h1 style={{ fontSize: 30, fontWeight: 900, color: '#111', lineHeight: 1.25, marginBottom: 20, letterSpacing: '-0.3px' }}>
          {noticia.post_title.replace(/\\'/g, "'")}
        </h1>

        <div style={{ display: 'flex', gap: 20, fontSize: 13, color: '#888', marginBottom: 28, paddingBottom: 20, borderBottom: '1px solid #eee', flexWrap: 'wrap' as const, alignItems: 'center' }}>
          <span> {fechaFormateada}</span>
          {noticia.autor && <span> {noticia.autor}</span>}
          <span style={{ background: '#f0f4fa', color: azul, fontSize: 11, fontWeight: 'bold', padding: '3px 10px', borderRadius: 3 }}>
             Archivo histórico
          </span>
        </div>

        <div
          className="noticia-contenido"
          style={{ fontSize: 17, lineHeight: 1.85, color: '#222' }}
          dangerouslySetInnerHTML={{ __html: noticia.post_content }}
        />
      </div>

      {/* FOOTER */}
      <footer style={{ background: '#111', color: '#ffb22a', padding: '28px 20px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' as const, gap: 16 }}>
          <div>
            <img src="/logo.png" alt="El Triángulo" style={{ height: 60, width: 'auto' }} />
            <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>Hemeroteca histórica · 2010–2025</div>
          </div>
          <div style={{ fontSize: 13, color: '#888', textAlign: 'right' as const }}>
            <a href="https://www.eltriangulo.es" style={{ color: '#ffffff', fontWeight: 'bold' }}>Ir al sitio actual →</a>
            <div style={{ marginTop: 6 }}>© El Triángulo. Todos los derechos reservados.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export async function getStaticProps({ params }: { params: { año: string, mes: string, slug: string } }) {
  const filePath = path.join(process.cwd(), `data/noticias/${params.año}/${params.mes}/${params.slug}.json`);
  try {
    const noticia = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    return { props: { noticia } };
  } catch {
    return { notFound: true };
  }
}

export async function getStaticPaths() {
  const indice = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data/indice.json'), 'utf-8'));
  const paths = indice
    .filter((n: { fecha: string, slug: string }) => {
      const fecha = new Date(n.fecha);
      const año = String(fecha.getFullYear());
      const mes = String(fecha.getMonth() + 1).padStart(2, '0');
      const filePath = path.join(process.cwd(), `data/noticias/${año}/${mes}/${n.slug}.json`);
      try {
        fs.accessSync(filePath);
        return true;
      } catch {
        return false;
      }
    })
    .map((n: { fecha: string, slug: string }) => {
      const fecha = new Date(n.fecha);
      return {
        params: {
          año: String(fecha.getFullYear()),
          mes: String(fecha.getMonth() + 1).padStart(2, '0'),
          slug: n.slug
        }
      };
    });
  return { paths, fallback: false };
}







