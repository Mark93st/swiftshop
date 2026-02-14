import CategoryForm from "@/components/admin/CategoryForm";

export default function NewCategoryPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">New Category</h1>
        <p className="text-muted-foreground">Create a new product group.</p>
      </div>
      <CategoryForm />
    </div>
  );
}
