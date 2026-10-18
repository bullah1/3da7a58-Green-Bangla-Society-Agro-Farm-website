# Green Bangla Landing Pages

আপনি ডেভেলপারকে মেসেজ বা ইমেইলে হুবহু নিচের টেক্সটটি কপি করে পাঠাতে পারেন। এতে উনি এক নজরেই বুঝে যাবেন যে সাইটটির কাজ কীভাবে শুরু করতে হবে:



---



**Hi,**



আমি **Green Bangla Society (gbtizarah.com)** এবং **Green Bangla Agro Farm**-এর জন্য একটি ল্যান্ডিং পেজ ওয়েবসাইট তৈরি করতে চাই। সাইটটির বিস্তারিত রিকোয়ারমেন্ট নিচে তুলে ধরা হলো:



### **Tech Stack & Architecture:**



* **Backend:** Node.js + Express.js (স্ট্যাটিক ফাইল এবং ক্লায়েন্ট-সাইড রাউটিং-এর জন্য)।

* **Frontend:** HTML5, CSS3, JavaScript (Tailwind CSS ব্যবহার করতে পারেন)।

* **Database & Auth:** **কোনো ডাটাবেজ, মেম্বার ড্যাশবোর্ড বা ইউজার লগইন থাকবে না।**

* **E-commerce:** কোনো Cart System বা Payment Gateway থাকবে না।



---



### **Design System & Color Palette (Must Follow):**



ব্র্যান্ডিং অনুযায়ী সিএসএস-এ নির্দিষ্ট এই কালার ভ্যারিয়েবলগুলো ব্যবহার করতে হবে:



```css

:root {

  --bg:         #f3faf5; /* Main Background */

  --bg2:        #eaf6ee; /* Secondary Background */

  --green:      #00A652; /* Primary Brand Green */

  --green-dark: #008E4C; /* Buttons, Links, Hover States */

  --green-deep: #045c33; /* Emphasis Text */

  --red:        #ED1B24; /* Primary Red */

  --red-dark:   #C21118; /* Hover States for Red */

  --text:       #0f2e1c; /* Main Body Text */

  --muted:      #4b6b57; /* Secondary Text */

  --card-bg:    #ffffff; /* Card Background */

  --border:     rgba(0, 142, 76, 0.18); /* Borders */

}



```



---



### **Website Structure & Features:**



**১. Green Bangla Tizarah (Financial & Society Section):**



* **Navigation:** Home, About, Services, Loan, DPS, FDR, Transparency, Contact.

* **Services:** Loan, DPS, FDR, and Savings-এর বিস্তারিত তথ্য প্রদর্শন।

* **Calculators:** DPS/FDR Calculator।

* **Forms:** Online Application Form (যা থেকে ডেটা ইমেইল বা সরাসরি WhatsApp-এ পাঠাবে)।

* **Transparency Section:** লাইসেন্স, অডিট রিপোর্ট, নীতিমালার তথ্য ও PDF ডাউনলোড অপশন।



**২. Green Bangla Agro Farm & Agro Shop:**



* **Agro Showcase:** Crop, Livestock, Poultry, Fish Farming, Nursery-এর বিস্তারিত।

* **Agro Shop Grid:** প্রোডাক্ট কার্ডগুলো একটি JSON ফাইল (`products.json`) থেকে ডাইনামিক্যালি ফেচ হবে।

* **Product Card Layout:** Image $\rightarrow$ Title $\rightarrow$ Price $\rightarrow$ Availability $\rightarrow$ **WhatsApp Button**।

* **WhatsApp Order Logic:** বাটনে ক্লিক করলে প্রোডাক্টের নামসহ রিডাইরেক্ট হবে:

`[https://wa.me/8801XXXXXXXXX?text=Hello,%20I%20want%20to%20order%20](https://wa.me/8801XXXXXXXXX?text=Hello,%20I%20want%20to%20order%20)[Product Name]`

* **Farm Dashboard:** খামারের মোট জমি, গবাদিপশু, পোল্ট্রি, এবং কর্মসংস্থানের ভিজ্যুয়াল স্ট্যাটিস্টিক্স/গ্রাফ।



---



**নোট:** সাইটটি সম্পূর্ণ **Mobile Responsive** এবং অত্যন্ত ফাস্ট লোডিং হতে হবে।



দয়া করে জানাবেন এটি সম্পন্ন করতে আপনার কতদিন সময় লাগবে এবং প্রজেক্টের খরচ কত হবে।



---

## Development

You need Node.js 22+ and npm.

```sh
npm install
npm run dev      # local dev server
npm run build    # production build
```

Copy `.env` with your Supabase URL and publishable key (`VITE_SUPABASE_URL`,
`VITE_SUPABASE_PUBLISHABLE_KEY`, plus `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
on the server for the product image route).

Replace `public/logo.png` with a high-resolution logo (square, at least 256×256).
