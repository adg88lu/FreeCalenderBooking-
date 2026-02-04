import BookingForm from "@/components/BookingForm";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8">
      <BookingForm />
      
      <p className="fixed bottom-4 text-center text-sm text-slate-400 font-medium opacity-50 hover:opacity-100 transition-opacity">
        Created by LBdanton.
      </p>
    </main>
  );
}
