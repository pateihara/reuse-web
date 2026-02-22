//src/app/_components/Product/ProductCard.js
import Image from "next/image";
import Link from "next/link";

export default function ProductCard({ item }) {
  const thumb = item?.images?.[0]?.url || "/assets/reuse_logo_focus.svg";

  const locationParts = [
    item?.city,
    item?.state ? `- ${item.state}` : null,
  ].filter(Boolean);

  return (
    <Link
      href={`/produto/${item.id}`}
      className="card bg-base-100 shadow hover:shadow-md transition"
    >
      <figure className="relative h-48 bg-base-200">
        <Image
          src={thumb}
          alt={item.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 25vw"
        />
      </figure>

      <div className="card-body p-4">
        <h3 className="font-semibold leading-tight">{item.title}</h3>

        <p className="text-sm opacity-70">
          {locationParts.join(" ")}
          {item?.condition ? ` • ${item.condition}` : ""}
        </p>
      </div>
    </Link>
  );
}