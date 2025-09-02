// Define o tipo para uma citação, incluindo seu ID, texto e categoria.
export type Quote = {
  id: number;
  text: string;
  category: string;
};

// Define o tipo para uma categoria, que é simplesmente uma string.
export type Category = string;

// Array de categorias de citações disponíveis no aplicativo.
export const categories: Category[] = [
  "Inspiração",
  "Motivação",
  "Sabedoria",
  "Amor",
  "Vida",
  "Humor",
];

// Array de citações, cada uma com um ID único, o texto da citação e sua categoria.
export const quotes: Quote[] = [
  { id: 1, text: "A única maneira de fazer um ótimo trabalho é amar o que você faz.", category: "Inspiração" },
  { id: 2, text: "Acredite que você pode e você já está no meio do caminho.", category: "Motivação" },
  { id: 3, text: "A jornada de mil milhas começa com um único passo.", category: "Sabedoria" },
  { id: 4, text: "Tudo que você precisa é amor.", category: "Amor" },
  { id: 5, text: "A vida é o que acontece quando você está ocupado fazendo outros planos.", category: "Vida" },
  { id: 6, text: "Não sou preguiçoso, estou em modo de economia de energia.", category: "Humor" },
  { id: 7, text: "Não se esforce para ser um sucesso, mas sim para ser de valor.", category: "Inspiração" },
  { id: 8, text: "O melhor momento para plantar uma árvore foi há 20 anos. O segundo melhor momento é agora.", category: "Motivação" },
  { id: 9, text: "Uma vida não examinada não vale a pena ser vivida.", category: "Sabedoria" },
  { id: 10, text: "Amar e ser amado é sentir o sol de ambos os lados.", category: "Amor" },
  { id: 11, text: "O propósito de nossas vidas é ser feliz.", category: "Vida" },
  { id: 12, text: "Eu disse ao meu computador que precisava de uma pausa e agora ele não para de me enviar anúncios de férias.", category: "Humor" },
  { id: 13, text: "Sua limitação—é apenas sua imaginação.", category: "Inspiração" },
  { id: 14, text: "Empurre-se, porque ninguém mais vai fazer isso por você.", category: "Motivação" },
  { id: 15, text: "O homem sábio sabe que não sabe nada.", category: "Sabedoria" },
  { id: 16, text: "A melhor coisa para se segurar na vida é um ao outro.", category: "Amor" },
  { id: 17, text: "Ocupe-se vivendo ou ocupe-se morrendo.", category: "Vida" },
  { id: 18, text: "Por que os cientistas não confiam nos átomos? Porque eles compõem tudo!", category: "Humor" },
];

// Array de modelos de vídeo, cada um com um ID, URL de imagem, dica de IA para a imagem e proporção de tela.
export const templates = [
  { id: -1, imageUrl: "", dataAiHint: "fundo solido", aspectRatio: "9:16" as const, name: "Modelo Padrão" },
  { id: 1, imageUrl: "https://picsum.photos/id/1018/1080/1920", dataAiHint: "paisagem montanha", aspectRatio: "9:16" as const },
];
