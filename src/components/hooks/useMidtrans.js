import { useEffect, useState } from 'react';

const useMidtrans = () => {
    const [snapLoaded, setSnapLoaded] = useState(false);

    useEffect(() => {
        const scriptId = 'midtrans-script';
        
        // --- KONFIGURASI ---
        // Ganti string di bawah ini dengan Client Key dari Dashboard Midtrans Anda
        // Contoh: 'SB-Mid-client-AbCdEfGhIjKlMnOp'
        const myClientKey = 'Mid-client-7cQwmcDYgOx5MNEy'; 

        // Cek apakah script sudah ada agar tidak duplikat
        if (document.getElementById(scriptId)) {
            setSnapLoaded(true);
            return;
        }

        const script = document.createElement('script');
        // URL Sandbox (Mode Testing)
        script.src = 'https://app.sandbox.midtrans.com/snap/snap.js'; 
        
        script.setAttribute('data-client-key', myClientKey);
        script.id = scriptId;
        script.onload = () => setSnapLoaded(true);

        document.body.appendChild(script);

        return () => {
            // Cleanup (opsional)
        }
    }, []);

    return snapLoaded;
};

export default useMidtrans;