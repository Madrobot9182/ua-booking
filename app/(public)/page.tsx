"use client";

import { useEffect, useRef } from "react";
import LoginButton from "@/components/login-button";

export default function UABookingSplashPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const shapes = Array.from({ length: 15 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: 50 + Math.random() * 150,
      dx: (Math.random() - 0.5) * 0.7,
      dy: (Math.random() - 0.5) * 0.7,
      angle: Math.random() * Math.PI * 2,
      dAngle: (Math.random() - 0.5) * 0.002,
    }));

    function draw() {
      ctx.clearRect(0, 0, width, height);

      shapes.forEach((shape) => {
        // Create radial gradient for each shape
        const grad = ctx.createRadialGradient(
          shape.x,
          shape.y,
          shape.radius * 0.1,
          shape.x,
          shape.y,
          shape.radius,
        );
        grad.addColorStop(0, "rgba(0, 77, 64, 0.4)"); // dark green
        grad.addColorStop(0.5, "rgba(255, 223, 0, 0.2)"); // soft gold
        grad.addColorStop(1, "rgba(0, 77, 64, 0)");

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(
          shape.x + Math.sin(shape.angle) * 10,
          shape.y + Math.cos(shape.angle) * 10,
          shape.radius,
          0,
          Math.PI * 2,
        );
        ctx.fill();

        // Update positions for fluid movement
        shape.x += shape.dx;
        shape.y += shape.dy;
        shape.angle += shape.dAngle;

        if (shape.x - shape.radius > width) shape.x = -shape.radius;
        if (shape.x + shape.radius < 0) shape.x = width + shape.radius;
        if (shape.y - shape.radius > height) shape.y = -shape.radius;
        if (shape.y + shape.radius < 0) shape.y = height + shape.radius;
      });

      requestAnimationFrame(draw);
    }

    draw();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* HERO ANIMATION */}
      <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
        <canvas ref={canvasRef} className="w-full h-full block" />

        {/* Large header text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-5xl md:text-7xl font-bold text-white drop-shadow-lg">
            UA-Booking
          </h1>
          <p className="mt-4 text-lg md:text-2xl text-white drop-shadow-md">
            One Unified Platform for Classroom & Study Room Booking
          </p>

          {/* Login button overlay */}
          <div className="mt-8">
            <LoginButton label="Try it out now!" />
          </div>
        </div>
      </section>

      {/* SCROLLING CONTENT */}
      <section className="max-w-6xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            A Unified Room Booking Platform That Just Works!
          </h1>

          <p className="text-lg text-muted-foreground">
            UA-Booking replaces fragmented classroom, study room, and seminar
            booking systems with one clean, centralized, and modern experience.
          </p>
        </div>
      </section>

      <section id="why" className="bg-muted/40 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
          <h2 className="text-3xl font-bold">Why Does This Exist?</h2>
          <p className="text-muted-foreground text-lg">
            More often or not, my university would double, or even triple, book
            the same room among multiple clubs. Everyone claims they got
            permission from the university, yet the system fails them again and
            again. Fragmented systems across multiple buildings, some still even
            using email and spreadsheets!
          </p>
          <p className="text-muted-foreground text-lg">
            These aren't harmless mistakes either. Clubs and organizations could
            spend weeks of planning only to end up playing negotiator and
            frustrating lose an entire day. We believe that there needs to be a
            better solution that both students and organizers deserve!
          </p>
          <p className="text-muted-foreground text-lg">
            Booking a room shouldn’t require navigating multiple outdated
            websites. UA-Booking streamlines scheduling into a single, intuitive
            platform — reducing confusion, improving transparency, and saving
            time for everyone.
          </p>
        </div>
      </section>

      <section id="about" className="py-20">
        <div className="max-w-4xl mx-auto px-6 space-y-8 text-center">
          <h2 className="text-3xl font-bold">About This Project</h2>
          <p className="text-muted-foreground text-lg">
            UA-Booking was built to modernize campus infrastructure with a
            consistent UI, reliable booking logic, and scalable architecture
            using Next.js and shadcn/ui. We are hosted on Neon, and can easily
            divest into any Postgres server.
          </p>

          <div className="space-y-4">
            <p className="text-muted-foreground">This project focuses on:</p>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Clean, accessible design</li>
              <li>• Reliable conflict-free scheduling</li>
              <li>• Maintainable and scalable architecture</li>
              <li>• Email updates. Clear communication. </li>
            </ul>
          </div>
        </div>
      </section>

      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} UA-Booking. Built for the University.
      </footer>
    </div>
  );
}
