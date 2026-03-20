import { useParams } from "react-router";

type InventoryItem = {
    id: string;
    name: string;
    sku: string;
    quantity: number;
    price?: number;
    category?: string;
    lastRestocked?: string;
};

const mockItems: Record<string, InventoryItem> = {
    "1": { id: "1", name: "Laptop", sku: "LAP-001", quantity: 5, price: 999.99, category: "Electronics", lastRestocked: "2026-03-15" },
    "2": { id: "2", name: "Monitor", sku: "MON-001", quantity: 12, price: 299.99, category: "Electronics", lastRestocked: "2026-03-10" },
    "3": { id: "3", name: "Keyboard", sku: "KEY-001", quantity: 25, price: 79.99, category: "Peripherals", lastRestocked: "2026-03-08" },
    "4": { id: "4", name: "Mouse", sku: "MOU-001", quantity: 30, price: 29.99, category: "Peripherals", lastRestocked: "2026-03-05" },
    "5": { id: "5", name: "USB Cable", sku: "USB-001", quantity: 100, price: 9.99, category: "Cables", lastRestocked: "2026-02-28" },
};

export function InventoryDetailPage() {
    const { id } = useParams<{ id: string }>();
    const item = id ? mockItems[id] : null;

    if (!item) {
        return <div className="text-red-600">Item not found</div>;
    }

    return (
        <div className="space-y-6 max-w-2xl">
            <div className="border border-slate-200 rounded-lg p-6 bg-white">
                <h2 className="text-2xl font-bold mb-4">{item.name}</h2>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <p className="text-sm font-medium text-slate-600">SKU</p>
                        <p className="text-lg">{item.sku}</p>
                    </div>

                    <div>
                        <p className="text-sm font-medium text-slate-600">Price</p>
                        <p className="text-lg">${item.price?.toFixed(2)}</p>
                    </div>

                    <div>
                        <p className="text-sm font-medium text-slate-600">Quantity in Stock</p>
                        <p className="text-lg font-semibold text-indigo-600">{item.quantity}</p>
                    </div>

                    <div>
                        <p className="text-sm font-medium text-slate-600">Category</p>
                        <p className="text-lg">{item.category}</p>
                    </div>

                    <div className="col-span-2">
                        <p className="text-sm font-medium text-slate-600">Last Restocked</p>
                        <p className="text-lg">{item.lastRestocked}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
