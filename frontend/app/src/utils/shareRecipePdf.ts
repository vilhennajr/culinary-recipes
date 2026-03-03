import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import type { Recipe } from '../types';
import { CATEGORIES } from '../constants/categories';

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('pt-BR');
  } catch {
    return dateStr;
  }
}

function buildRecipeHtml(recipe: Recipe): string {
  const categoryName = recipe.categoryId
    ? (CATEGORIES.find((c) => c.id === recipe.categoryId)?.name ?? '—')
    : '—';

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${recipe.name ?? 'Receita'}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: Georgia, serif;
      max-width: 720px;
      margin: 40px auto;
      padding: 0 24px;
      color: #111;
      line-height: 1.5;
    }
    h1 {
      font-size: 1.8rem;
      margin-bottom: 8px;
      color: #1a1a1a;
    }
    .divider {
      border: none;
      border-top: 2px solid #e5e5e5;
      margin: 16px 0;
    }
    .meta {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin: 16px 0 24px;
      font-size: 0.9rem;
      color: #555;
    }
    .meta-item { }
    .meta-label { font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; color: #888; margin-bottom: 2px; }
    .meta-value { font-weight: 600; color: #111; font-size: 1rem; }
    section { margin-top: 24px; }
    section h2 {
      font-size: 1.1rem;
      font-family: Georgia, serif;
      border-bottom: 1px solid #ddd;
      padding-bottom: 6px;
      margin-bottom: 12px;
      color: #333;
    }
    pre {
      white-space: pre-wrap;
      font-family: inherit;
      font-size: 0.95rem;
      line-height: 1.7;
      color: #333;
    }
    .footer {
      margin-top: 40px;
      padding-top: 12px;
      border-top: 1px solid #eee;
      font-size: 0.75rem;
      color: #aaa;
      text-align: center;
    }
  </style>
</head>
<body>
  <h1>${recipe.name ?? 'Receita sem título'}</h1>
  <hr class="divider" />
  <div class="meta">
    <div class="meta-item">
      <div class="meta-label">Categoria</div>
      <div class="meta-value">${categoryName}</div>
    </div>
    <div class="meta-item">
      <div class="meta-label">Porções</div>
      <div class="meta-value">${recipe.servings != null ? recipe.servings : '—'}</div>
    </div>
    <div class="meta-item">
      <div class="meta-label">Tempo de preparo</div>
      <div class="meta-value">${recipe.preparationTimeMinutes != null ? recipe.preparationTimeMinutes + ' min' : '—'}</div>
    </div>
    <div class="meta-item">
      <div class="meta-label">Criado em</div>
      <div class="meta-value">${formatDate(recipe.createdAt)}</div>
    </div>
  </div>

  ${recipe.ingredients ? `<section><h2>🧂 Ingredientes</h2><pre>${recipe.ingredients}</pre></section>` : ''}

  <section>
    <h2>👨‍🍳 Modo de Preparo</h2>
    <pre>${recipe.preparationMethod}</pre>
  </section>

  <div class="footer">Gerado pelo app Receitas Culinárias</div>
</body>
</html>
  `;
}

export async function shareRecipePdf(recipe: Recipe): Promise<void> {
  const html = buildRecipeHtml(recipe);

  const { uri } = await Print.printToFileAsync({ html, base64: false });

  const isAvailable = await Sharing.isAvailableAsync();
  if (!isAvailable) {
    throw new Error('Compartilhamento não disponível neste dispositivo.');
  }

  const fileName = (recipe.name ?? 'receita').replace(/[^a-z0-9]/gi, '_').toLowerCase();

  await Sharing.shareAsync(uri, {
    mimeType: 'application/pdf',
    dialogTitle: `Compartilhar receita: ${recipe.name ?? 'Receita'}`,
    UTI: 'com.adobe.pdf',
  });

  void fileName; // used only for context; expo-sharing uses the uri filename
}
