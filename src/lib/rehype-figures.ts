// rehype step of the Markdown pipeline (astro.config.mjs, spec #110 "Images"): every image of a
// blog post's body becomes a figure. A Markdown title (`![alt](./a.jpg "Caption")`) becomes its
// figcaption and leaves the img. A local image (next to the post, optimised by Astro) sits in a
// button that opens the post's Lightbox at it (`data-lightbox-open`, src/components/Lightbox.astro);
// the list of those images, in order, is handed to the page as `remarkPluginFrontmatter.figures`
// for PostBody (src/sections/blog/PostBody.astro) to build the Lightbox's set.
//
// An image is lifted out of its paragraph: the text before and after it stays in paragraphs of
// its own. An image that is not directly in a paragraph (inside a link, a list item's text…) is
// left alone. Runs before Astro's own rehype-images, which then optimises the img.

/** The Lightbox `id` that the openers name; PostBody renders the Lightbox under it. */
export const POST_LIGHTBOX = "post-images";

/** A local image of the post, as PostBody needs it for the Lightbox. */
export interface Figure {
  /** The Markdown src, relative to the post file, e.g. `./a.jpg`. */
  src: string;
  alt: string;
  caption?: string;
}

/** Responsive sizes for a body image: the prose column is `--width-small` (48rem) wide. */
const WIDTHS = [500, 800, 1080, 1600];
const SIZES = "(max-width: 767px) 100vw, 48rem";

type Props = Record<string, unknown>;
interface Node {
  type: string;
  tagName?: string;
  properties?: Props;
  value?: string;
  children?: Node[];
}

const element = (tagName: string, properties: Props, children: Node[]): Node => ({ type: "element", tagName, properties, children });
const isImg = (n: Node) => n.type === "element" && n.tagName === "img";
/** A run of a paragraph worth keeping: anything but whitespace and line breaks. */
const hasContent = (run: Node[]) => run.some((n) => (n.type === "text" ? (n.value ?? "").trim() !== "" : !(n.type === "element" && n.tagName === "br")));
/** Local as Astro's remark-collect-images sees it: not a URL, not an absolute path. */
const isLocal = (src: string) => !URL.canParse(src) && !src.startsWith("/");

export default function rehypeFigures() {
  return (tree: Node, file: { data: { astro?: { frontmatter?: Props } } }) => {
    const figures: Figure[] = [];
    const openers: Node[] = [];

    function figure(img: Node): Node {
      const props = img.properties ?? {};
      const src = String(props.src ?? "");
      const alt = String(props.alt ?? "");
      const caption = typeof props.title === "string" && props.title.trim() ? props.title.trim() : undefined;
      delete props.title;
      const children: Node[] = [];
      if (isLocal(src)) {
        // Read by Astro's rehype-images as options of getImage().
        props.widths = WIDTHS;
        props.sizes = SIZES;
        const opener = element("button", { type: "button", dataLightboxOpen: POST_LIGHTBOX, dataIndex: figures.length }, [img]);
        figures.push({ src, alt, ...(caption && { caption }) });
        openers.push(opener);
        children.push(opener);
      } else {
        children.push(img);
      }
      if (caption) children.push(element("figcaption", {}, [{ type: "text", value: caption }]));
      return element("figure", {}, children);
    }

    /** A paragraph with images, split into paragraphs of text and figures. */
    function split(p: Node): Node[] {
      const out: Node[] = [];
      let run: Node[] = [];
      const flush = () => {
        if (hasContent(run)) out.push({ ...p, children: run });
        run = [];
      };
      for (const child of p.children ?? []) {
        if (isImg(child)) {
          flush();
          out.push(figure(child));
        } else run.push(child);
      }
      flush();
      return out;
    }

    function walk(node: Node) {
      if (!node.children) return;
      node.children = node.children.flatMap((child) => {
        if (child.type === "element" && child.tagName === "p" && child.children?.some(isImg)) return split(child);
        walk(child);
        return [child];
      });
    }

    walk(tree);
    openers.forEach((opener, k) => {
      opener.properties!.ariaLabel = `Phóng to ảnh ${k + 1} / ${figures.length}: ${figures[k].alt}`;
    });
    if (figures.length) {
      file.data.astro ??= {};
      file.data.astro.frontmatter ??= {};
      file.data.astro.frontmatter.figures = figures;
    }
  };
}
