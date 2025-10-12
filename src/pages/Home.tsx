import { useTitle } from "../hooks/useTitle";
import Hero from "../components/Hero";
import ValueProp from "../components/ValueProp";
import Portfolio from "../components/Portfolio";

export default function Home() {
  useTitle("Data Edge");
  return (
    <>
      <Hero />
      <ValueProp />
      <Portfolio />
    </>
  );
}
