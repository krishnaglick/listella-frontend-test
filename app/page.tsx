import { Uploader } from "listella-lib";

export default function Home() {
  return (
    <div className="flex h-screen">
      <div className="m-auto flex gap-3">
        <Uploader />
      </div>
    </div>
  );
}
