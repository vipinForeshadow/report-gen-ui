import { Inter } from "next/font/google";
import { useState } from "react";

const Integration = () => {
  const [file, setFile] = useState(null);
  const [email, setEmail] = useState("");
  const [categories, setCategories] = useState({
    product: [],
    coaching: [],
    community: [],
    ebook: [],
    external_product: [],
  });

  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setEmailError(""); // Reset email error on change
  };

  const handleKeywordChange = (category, keywords) => {
    setCategories({ ...categories, [category]: keywords });
  };

  const handleBackspace = (category) => {
    if (!categories[category].length) {
      // Remove the category if there are no keywords
      const updatedCategories = { ...categories };
      delete updatedCategories[category];
      setCategories(updatedCategories);
    }
  };

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Invalid email address");
      return false;
    }
    return true;
  };

  const constructCustomSignals = () => {
    const customSignals = [];

    for (const category in categories) {
      if (categories[category].length > 0) {
        customSignals.push({
          signal: categories[category],
          category: category,
        });
      }
    }

    return JSON.stringify(customSignals);
  };

  const handleSubmit = () => {
    if (!validateEmail()) {
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("email", email);
    formData.append("custom_signals", constructCustomSignals());

    fetch("http://127.0.0.1:5000/getLeads", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.text())
      .then((data) => {
        console.log(data);
        setLoading(false);
        alert("You will receive an email shortly");
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
      });
  };

  return (
    <div className="container mx-auto my-10 w-[100vw] lg:w-[40vw] px-4">
      <h1 className="text-3xl font-bold mb-4">Lead keywords Report</h1>
      <p className="text-sm text-gray-400">
        Upload the xlsx file and input your Keywords
      </p>
      <input
        type="file"
        className="mt-4"
        onChange={handleFileChange}
        accept=".xlsx"
      />
      <div className="my-4">
        <label className="block mb-2">Email:</label>
        <input
          type="text"
          placeholder="Enter your email"
          value={email}
          onChange={handleEmailChange}
          className={`block w-full p-2 border rounded text-gray-800 ${
            emailError ? "border-red-500" : ""
          }`}
        />
        {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
      </div>
      <div className="my-4">
        <h2 className="text-xl font-semibold mb-2">Keywords</h2>
        <label className="block mb-2">Product:</label>
        <input
          type="text"
          placeholder="Enter keywords (comma-separated)"
          value={categories.product.join(",")}
          onChange={(e) =>
            handleKeywordChange("product", e.target.value.split(","))
          }
          onKeyDown={(e) => e.key === "Backspace" && handleBackspace("product")}
          className="block w-full p-2 border rounded text-gray-800"
        />
      </div>
      <div className="my-4">
        <label className="block mb-2">Coaching:</label>
        <input
          type="text"
          placeholder="Enter keywords (comma-separated)"
          value={categories.coaching.join(",")}
          onChange={(e) =>
            handleKeywordChange("coaching", e.target.value.split(","))
          }
          onKeyDown={(e) =>
            e.key === "Backspace" && handleBackspace("coaching")
          }
          className="block w-full p-2 border rounded text-gray-800"
        />
      </div>
      <div className="my-4">
        <label className="block mb-2">Community:</label>
        <input
          type="text"
          placeholder="Enter keywords (comma-separated)"
          value={categories.community.join(",")}
          onChange={(e) =>
            handleKeywordChange("community", e.target.value.split(","))
          }
          onKeyDown={(e) =>
            e.key === "Backspace" && handleBackspace("community")
          }
          className="block w-full p-2 border rounded text-gray-800"
        />
      </div>
      <div className="my-4">
        <label className="block mb-2">Ebook:</label>
        <input
          type="text"
          placeholder="Enter keywords (comma-separated)"
          value={categories.ebook.join(",")}
          onChange={(e) =>
            handleKeywordChange("ebook", e.target.value.split(","))
          }
          onKeyDown={(e) => e.key === "Backspace" && handleBackspace("ebook")}
          className="block w-full p-2 border rounded text-gray-800"
        />
      </div>
      <div className="my-4">
        <label className="block mb-2">External Product:</label>
        <input
          type="text"
          placeholder="Enter keywords (comma-separated)"
          value={categories.external_product.join(",")}
          onChange={(e) =>
            handleKeywordChange("external_product", e.target.value.split(","))
          }
          onKeyDown={(e) =>
            e.key === "Backspace" && handleBackspace("external_product")
          }
          className="block w-full p-2 border rounded text-gray-800"
        />
      </div>
      <button
        onClick={handleSubmit}
        className={`${
          loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500"
        } text-white px-4 py-2 rounded disabled:cursor-not-allowed`}
        disabled={!file || !email || loading || emailError}
      >
        {loading ? "Loading..." : "Submit"}
      </button>
    </div>
  );
};

export default Integration;
