import React, { useEffect, useState } from "react";
import { getServices } from "../lib/api";
import { StaggerGroup, StaggerItem } from "../components/motion";
import ServiceCard from "../components/ServiceCard";
import PageHero from "../components/PageHero";
import SEO from "../components/SEO";

export default function Services() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    getServices().then(setServices).catch(() => {});
  }, []);

  return (
    <div data-testid="services-page">
      <SEO title="Our Services" description="Explore 14 premium maternity and parenting wellness services — Garbh Sanskar, prenatal yoga, baby massage, lactation guidance, and more." />
      <PageHero
        eyebrow="Our Services"
        title="Wellness woven through every chapter"
        subtitle="From the first heartbeat to the joys of parenting, explore our complete ecosystem of nurturing care."
        image="wellness_program"
        crumbs={[{ label: "Services" }]}
      />
      <section className="section-py bg-ivory">
        <div className="container-px">
          <StaggerGroup className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {services.map((s) => (
              <StaggerItem key={s.slug}>
                <ServiceCard service={s} />
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>
    </div>
  );
}
