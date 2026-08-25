import type { Metadata } from "next";
import Education from "../education";

export const metadata: Metadata = {
    title: "Education",
    description: "Amanda N. Robinson's education at Worcester Polytechnic Institute, pursuing a B.S. in Computer Science with a minor in Economics."
};

export default function EducationPage() {
    return <Education/>;
}
