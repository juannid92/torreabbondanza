import antipastiImg from "@/assets/kitchen-antipasti.jpg";
import primiImg from "@/assets/kitchen-primi.jpg";
import secondiImg from "@/assets/kitchen-secondi.jpg";
import dolciImg from "@/assets/kitchen-dolci.jpg";
import wineImg from "@/assets/kitchen-wine.jpg";

/**
 * Dati della carta. Valori marcati DA CONFERMARE col cliente.
 */
export type DietTag = "veg" | "vegan" | "gf";

export interface MenuDish {
  id: string;
  name: string;
  description: string;
  price?: string; // DA CONFERMARE
  diet?: DietTag[];
  signature?: boolean;
  image: string;
}

export interface MenuCategoryData {
  id: string;
  numeral: string;
  label: string;
  dishes: MenuDish[];
}

export const MENU: MenuCategoryData[] = [
  {
    id: "antipasti",
    numeral: "I",
    label: "Antipasti di terra",
    dishes: [
      {
        id: "olive-fritte",
        name: "Olive fritte",
        description: "Olive verdi panate e fritte croccanti, sale grosso.",
        price: "8", // DA CONFERMARE
        diet: ["veg"],
        image: antipastiImg,
      },
      {
        id: "salumi-formaggi",
        name: "Salumi e formaggi locali",
        description: "Selezione di produttori della Murgia, mostarda di stagione.",
        price: "14", // DA CONFERMARE
        image: antipastiImg,
      },
      {
        id: "parmigiana",
        name: "Parmigiana di melanzane",
        description: "Strati lenti, mozzarella e basilico fresco.",
        price: "10", // DA CONFERMARE
        diet: ["veg", "gf"],
        image: antipastiImg,
      },
      {
        id: "focaccia",
        name: "Focaccia della casa",
        description: "Pomodorino, origano, olio extravergine pugliese.",
        price: "6", // DA CONFERMARE
        diet: ["vegan"],
        image: antipastiImg,
      },
      {
        id: "fave-peperoni",
        name: "Purè di fave bianche e peperoni fritti",
        description: "Piatto della tradizione contadina, dolce e tostato.",
        price: "9", // DA CONFERMARE
        diet: ["vegan", "gf"],
        image: antipastiImg,
      },
    ],
  },
  {
    id: "primi",
    numeral: "II",
    label: "Primi",
    dishes: [
      {
        id: "nido-linguine",
        name: "Nido di linguine, carne e funghi",
        description:
          "Il signature della casa: linguine intrecciate a nido, ragù bianco e funghi porcini.",
        price: "16", // DA CONFERMARE
        signature: true,
        image: primiImg,
      },
      {
        id: "orecchiette",
        name: "Orecchiette al ragù",
        description: "Pasta fresca tirata a mano, sugo lento di carne mista.", // DA CONFERMARE
        price: "14",
        image: primiImg,
      },
      {
        id: "risotto-stagione",
        name: "Risotto di stagione",
        description: "Mantecato lento, materia prima del momento.", // DA CONFERMARE
        price: "15",
        diet: ["veg", "gf"],
        image: primiImg,
      },
    ],
  },
  {
    id: "secondi",
    numeral: "III",
    label: "Secondi",
    dishes: [
      {
        id: "brasato",
        name: "Brasato di carne al vino",
        description:
          "Cottura lenta in riduzione di Primitivo, purè di patate, timo fresco.",
        price: "20", // DA CONFERMARE
        signature: true,
        diet: ["gf"],
        image: secondiImg,
      },
      {
        id: "agnello",
        name: "Agnello al forno",
        description: "Patate, rosmarino, alloro — ricetta di famiglia.", // DA CONFERMARE
        price: "22",
        diet: ["gf"],
        image: secondiImg,
      },
      {
        id: "verdure-griglia",
        name: "Verdure dell'orto alla griglia",
        description: "Selezione di stagione, olio nuovo, sale di Cervia.",
        price: "12", // DA CONFERMARE
        diet: ["vegan", "gf"],
        image: secondiImg,
      },
    ],
  },
  {
    id: "dolci",
    numeral: "IV",
    label: "Dolci della casa",
    dishes: [
      {
        id: "cheesecake",
        name: "Cheesecake all'amaretto",
        description:
          "Crema morbida, amaretti croccanti, caramello salato.",
        price: "7", // DA CONFERMARE
        signature: true,
        diet: ["veg"],
        image: dolciImg,
      },
      {
        id: "semifreddo",
        name: "Semifreddo alle mandorle",
        description: "Mandorle tostate, miele della Murgia.", // DA CONFERMARE
        price: "6",
        diet: ["veg", "gf"],
        image: dolciImg,
      },
      {
        id: "frutta",
        name: "Frutta di stagione",
        description: "Selezione del giorno dal mercato.",
        price: "5", // DA CONFERMARE
        diet: ["vegan", "gf"],
        image: dolciImg,
      },
    ],
  },
  {
    id: "cantina",
    numeral: "V",
    label: "La Cantina",
    dishes: [
      {
        id: "primitivo-masseria",
        name: "Primitivo della masseria",
        description:
          "Vino di produzione propria. Profondo, caldo, generoso — il calice che racconta la terra.",
        price: "5 / cal · 22 / bot", // DA CONFERMARE
        signature: true,
        image: wineImg,
      },
      {
        id: "negroamaro",
        name: "Negroamaro del Salento",
        description: "Tannico e speziato, perfetto coi secondi.", // DA CONFERMARE
        price: "6 / cal",
        image: wineImg,
      },
      {
        id: "fiano",
        name: "Fiano dei colli",
        description: "Bianco fresco, agrumato, per antipasti e primi leggeri.", // DA CONFERMARE
        price: "5 / cal",
        image: wineImg,
      },
    ],
  },
];

export const DIET_LABEL: Record<DietTag, string> = {
  veg: "Vegetariano",
  vegan: "Vegano",
  gf: "Senza glutine",
};
