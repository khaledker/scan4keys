export default function CrtEffects() {
  return (
    <>
      <div className="fixed inset-0 z-[61] scanlines pointer-events-none" />
      <div className="fixed inset-0 z-[62] crt-rolling-wave pointer-events-none" />
      <div className="fixed inset-0 z-[63] vignette pointer-events-none" />
    </>
  );
}
