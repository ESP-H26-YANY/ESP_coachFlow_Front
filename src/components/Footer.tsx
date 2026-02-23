import { Footer } from "flowbite-react";

export default function MyFooter() {
  const Foot = Footer as any;

  return (
    <Foot container className="mt-auto">
      <div className="w-full text-center">
        <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400 w-full text-center">
        © 2026 <span className="hover:underline">CoachFlow</span>. Tous droits réservés YANY BOUDEDJA.
      </span>   
      </div>
    </Foot>
  );
}