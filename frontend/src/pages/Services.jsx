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
      <SEO
        title="Maternity & Parenting Wellness Services in Vadodara"
        description="Explore 14 premium maternity and parenting wellness services at Sparsh Pehla, Vadodara — Garbh Sanskar, prenatal yoga, baby massage, lactation guidance, postpartum care and more."
        canonical={`${window.location.origin}/services`}
      />
      <PageHero
        eyebrow="Our Services"
        title="Wellness woven through every chapter"
        subtitle="From the first heartbeat to the joys of parenting, explore our complete ecosystem of nurturing care."
        image="wellness_program"
        crumbs={[{ label: "Services" }]}
      />
      <section className="section-py bg-ivory">
        <div className="container-px">
          {services.length === 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-72 rounded-2xl bg-beige animate-pulse" />
              ))}
            </div>
          ) : (
            <StaggerGroup className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {services.map((s) => (
                <StaggerItem key={s.slug}>
                  <ServiceCard service={s} />
                </StaggerItem>
              ))}
            </StaggerGroup>
          )}
        </div>
      </section>
    </div>
  );
}
