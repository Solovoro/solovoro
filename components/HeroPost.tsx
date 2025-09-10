// components/HeroPost.tsx
import CoverImage from "./CoverImage";

type Props = {
  title?: string;
  coverImage?: string;
  date?: string;
  excerpt?: string;
  author?: string;
  slug?: string;
};

export default function HeroPost({
  title,
  coverImage,
  date,
  excerpt,
  author,
  slug,
}: Props) {
  return (
    <section>
      <div className="mb-8 md:mb-16">
        <CoverImage
          slug={slug ?? ""}
          title={title ?? ""}
          image={coverImage ?? ""}
          priority
        />
      </div>
      <div className="mb-20 md:mb-28 md:grid md:grid-cols-2 md:gap-x-16 lg:gap-x-8">
        <div>
          <h3 className="mb-4 text-4xl leading-tight lg:text-5xl">
            {title ?? ""}
          </h3>
          <div className="mb-4 text-lg">{date ?? ""}</div>
        </div>
        <div>
          <p className="mb-4 text-lg leading-relaxed">{excerpt ?? ""}</p>
          <p className="text-sm text-gray-500">By {author ?? "Unknown"}</p>
        </div>
      </div>
    </section>
  );
}
