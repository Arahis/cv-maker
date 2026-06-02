export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <div className="grid min-h-svh lg:grid-cols-2">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">{children}</div>
        </div>

        <div className="bg-muted relative hidden lg:block"></div>
      </div>
    </div>
  );
}
