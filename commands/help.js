module.exports = `Halo teman! Selamat datang di Expense Manager!

Berikut adalah perintah yang dapat kamu gunakan:
/help = tampilkan daftar perintah


/expense [harga] [nama_barang] = Mencatat pengeluaran.
Contoh: /expense 25000 burger king.


/income [harga] [nama_barang] = Mencatat pemasukan.
Contoh: /income 1000000 jual tv.

/koreksi = Mengubah nilai harta liquid.

/transfer [jumlah] [keterangan] = mentransfer dana dari satu harta liquid ke harta liquid lainnya
Contoh: /transfer 10000000 tarik ATM BCA

/set_investment = Set nilai asset

/void [transaction_id] = Menghapus transaksi dengan ID tertentu
Contoh: /void 123

/list_harta = Melihat daftar harta

/tail = Melihat 10 transaksi terakhir
`
