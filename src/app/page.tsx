import type { Metadata } from "next";
import HomePage from "./home_page";

// No title here — inherits the root layout's metadata.title.default
// unchanged ("Amanda N. Robinson | Software Developer"), rather than
// picking up the "%s | Amanda N. Robinson" template every other page uses,
// which would reorder it to "... | Amanda N. Robinson | Amanda N.
// Robinson"-style redundancy for the one page that already has the name
// first.
export const metadata: Metadata = {
    description: "Portfolio of Amanda N. Robinson, a software developer who builds thoughtful, creative products for real-world problems."
};

export default function Home() {
    return <HomePage/>;
}
