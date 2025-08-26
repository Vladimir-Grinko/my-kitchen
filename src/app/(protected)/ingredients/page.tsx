import IngredientsTable from "@/components/UI/tables/ingredientsTable";
import IngredientForm from "@/forms/ingredient.form";

const IngredientsPage = () => {
  return (
    <div>
      <IngredientForm />
      <IngredientsTable />
    </div>
  );
};

export default IngredientsPage;
