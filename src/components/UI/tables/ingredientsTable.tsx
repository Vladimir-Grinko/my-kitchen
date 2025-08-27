"use client";

import { CATEGORY_OPTIONS, UNIT_OPTIONS } from "@/constants/select-options";
import { useAuthStore } from "@/store/auth.store";
import { useIngredientStore } from "@/store/ingredient.store";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Pagination,
} from "@heroui/react";
import { useMemo, useState } from "react";

const IngredientsTable = () => {
  const { ingredients, removeIngredient, isLoading } = useIngredientStore();
  const { isAuth } = useAuthStore();
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  const pages = Math.ceil(ingredients.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return ingredients.slice(start, end);
  }, [page, ingredients]);

  const handleDelete = async (id: string) => {
    await removeIngredient(id);
  };

  const getCategoryLabel = (value: string) => {
    const option = CATEGORY_OPTIONS.find((opt) => opt.value === value);
    return option ? option.label : value;
  };

  const getUnitLabel = (value: string) => {
    const option = UNIT_OPTIONS.find((opt) => opt.value === value);
    return option ? option.label : value;
  };

  if (!isAuth) {
    return <p>Не авторизован</p>;
  }

  return !isLoading && isAuth ? (
    <Table
      aria-label="Список ингредиентов"
      classNames={{
        wrapper: "mt-2",
        table: "w-full",
        th: "text-black",
        td: "text-black",
      }}
      bottomContent={
        <div className="flex w-full justify-center">
          <Pagination
            isCompact
            showControls
            showShadow
            color="secondary"
            page={page}
            total={pages}
            onChange={(page) => setPage(page)}
          />
        </div>
      }
    >
      <TableHeader>
        <TableColumn>Название</TableColumn>
        <TableColumn>Категория</TableColumn>
        <TableColumn>Ед. изм.</TableColumn>
        <TableColumn>Цена за единицу</TableColumn>
        <TableColumn>Описание</TableColumn>
        <TableColumn>Действия</TableColumn>
      </TableHeader>
      <TableBody>
        {items.map((ingredient) => (
          <TableRow key={ingredient.id}>
            <TableCell>{ingredient.name}</TableCell>
            <TableCell>{getCategoryLabel(ingredient.category)}</TableCell>
            <TableCell>{getUnitLabel(ingredient.unit)}</TableCell>
            <TableCell>
              {ingredient.pricePerUnit !== null
                ? `${ingredient.pricePerUnit} ₽`
                : "-"}
            </TableCell>
            <TableCell>{ingredient.description || "-"}</TableCell>
            <TableCell>
              <Button
                color="danger"
                size="sm"
                onPress={() => handleDelete(ingredient.id)}
              >
                Удалить
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ) : (
    <p className="mt-4">Загрузка....</p>
  );
};

export default IngredientsTable;
