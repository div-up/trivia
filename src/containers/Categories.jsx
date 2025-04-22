import React from "react";
import Sidebar from "./Sidebar";
import Quiz from "./Quiz";
import { useNavigate } from "react-router-dom";
import { categories } from "../constants";

const Categories = () => {
  const navigate = useNavigate();

  const handleCategorySelect = ({ name, id }) => {
    navigate(`/quiz/${name}`, {
      state: { name, id },
    });
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="contain flex-1 p-6 overflow-y-auto">
        <header className="bg-blue-800 text-white py-6 shadow-lg">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold text-center">
              All <span className="text-yellow-400">Categories</span>
            </h1>
            <p className="text-center text-blue-200 mt-2">
              Select a category to play!
            </p>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          <div>
            <div className="grid grid-cols-3 gap-6 ">
              {categories.map((category) => (
                <div
                  key={category.name}
                  className="bg-blue-50 p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center"
                  onClick={() =>
                    handleCategorySelect({
                      name: category.name,
                      id: category.id,
                    })
                  }
                >
                  <div
                    className={`h-20 w-20 rounded-full cursor-pointer bg-orange-50 flex items-center justify-center text-4xl mb-4`}
                  >
                    {category.icon}
                  </div>
                  <h3 className="font-bold text-gray-800">{category.name}</h3>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Categories;
