/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", 
  ],
  theme: {
    extend: {
      colors: {
        // Warna Kustom Anda (Sudah benar)
        'brand-dark': '#800000', 
        'brand-dark-accent': '#6B0F1A', 
        'brand-light-bg': '#FFFBFB', 
        'brand-icon-bg': '#EBC4C4',
        'brand-beige-bg': '#FBF6F0',     
        'brand-beige-header': '#F5EBE0',
      },
      
      // 💥 TAMBAHKAN BAGIAN ANIMASI INI 💥
      keyframes: {
        float: {
            '0%, 100%': { transform: 'translateY(0)' },
            '50%': { transform: 'translateY(-20px)' }, // Naik 20px ke atas
        }
      },
      animation: {
          float: 'float 3s ease-in-out infinite', // Durasi 3 detik, berulang selamanya
      }
    },
  },
  plugins: [],
}