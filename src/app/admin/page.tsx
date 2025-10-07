"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody, CardHeader, Button, Input, Textarea, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/react";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/sections";
import { useAuth } from "@/contexts/auth-context";
import { Product } from "@/types";
import { Plus, Edit, Trash2, Upload, Eye } from "lucide-react";

export default function AdminPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editMode, setEditMode] = useState<"create" | "edit" | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: ""
  });

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      router.push("/login");
      return;
    }

    if (user?.role === "admin") {
      fetchProducts();
    }
  }, [user, isLoading, router]);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/dodo/products");
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleCreateProduct = () => {
    setEditMode("create");
    setFormData({ name: "", description: "", price: "", image: "" });
    setSelectedProduct(null);
    onOpen();
  };

  const handleEditProduct = (product: Product) => {
    setEditMode("edit");
    setSelectedProduct(product);
    setFormData({
      name: product.name || "",
      description: product.description || "",
      price: ((product.price || 0) / 100).toString(),
      image: product.image || ""
    });
    onOpen();
  };

  const handleSaveProduct = async () => {
    // This would typically make an API call to save the product
    console.log("Saving product:", formData);

    // For now, just close the modal and refresh products
    onClose();
    fetchProducts();
  };

  const handleDeleteProduct = async (productId: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      // This would typically make an API call to delete the product
      console.log("Deleting product:", productId);
      fetchProducts();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-default-500">Loading...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Admin Panel
              </h1>
              <p className="mt-2 text-foreground/70">
                Manage products and settings
              </p>
            </div>
            <Button
              color="primary"
              startContent={<Plus size={16} />}
              onClick={handleCreateProduct}
            >
              Add Product
            </Button>
          </div>

          {/* Products Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {loadingProducts ? (
              // Loading skeletons
              Array.from({ length: 6 }).map((_, i) => (
                <Card key={i}>
                  <CardBody className="p-4">
                    <div className="animate-pulse">
                      <div className="h-32 bg-default-200 rounded mb-4"></div>
                      <div className="h-4 bg-default-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-default-200 rounded w-1/2 mb-4"></div>
                      <div className="flex gap-2">
                        <div className="h-8 bg-default-200 rounded w-16"></div>
                        <div className="h-8 bg-default-200 rounded w-16"></div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))
            ) : (
              products.map((product) => (
                <Card key={product.product_id || product.id}>
                  <CardBody className="p-4">
                    <div className="aspect-video bg-default-100 rounded-lg mb-4 flex items-center justify-center">
                      {product.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-12 opacity-80"
                        />
                      ) : (
                        <Upload className="text-default-400" size={24} />
                      )}
                    </div>
                    <h3 className="font-semibold mb-2">{product.name}</h3>
                    <p className="text-sm text-default-500 mb-4 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-medium">
                        ${((product.price || 0) / 100).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="flat"
                        startContent={<Eye size={14} />}
                        as="a"
                        href={`/products/${product.product_id || product.id}`}
                      >
                        View
                      </Button>
                      <Button
                        size="sm"
                        color="primary"
                        variant="flat"
                        startContent={<Edit size={14} />}
                        onClick={() => handleEditProduct(product)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        color="danger"
                        variant="flat"
                        startContent={<Trash2 size={14} />}
                        onClick={() => handleDeleteProduct(product.product_id || product.id || "")}
                      >
                        Delete
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>
      <Footer />

      {/* Product Edit/Create Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalContent>
          <ModalHeader>
            {editMode === "create" ? "Add New Product" : "Edit Product"}
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label="Product Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                variant="bordered"
              />
              <Textarea
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                variant="bordered"
                rows={3}
              />
              <Input
                label="Price (USD)"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                variant="bordered"
                startContent="$"
              />
              <Input
                label="Image URL"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                variant="bordered"
                placeholder="https://example.com/image.jpg"
              />
              {formData.image && (
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-default-500 mb-2">Image Preview:</p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="h-16 rounded"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClose}>
              Cancel
            </Button>
            <Button color="primary" onPress={handleSaveProduct}>
              {editMode === "create" ? "Create Product" : "Save Changes"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}