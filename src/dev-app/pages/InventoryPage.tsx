import { useNavigate } from "react-router";

type InventoryItem = {
    id: string;
    name: string;
    sku: string;
    quantity: number;
};

const mockItems: InventoryItem[] = [
    { id: "1", name: "Laptop", sku: "LAP-001", quantity: 5 },
    { id: "2", name: "Monitor", sku: "MON-001", quantity: 12 },
    { id: "3", name: "Keyboard", sku: "KEY-001", quantity: 25 },
    { id: "4", name: "Mouse", sku: "MOU-001", quantity: 30 },
    { id: "5", name: "USB Cable", sku: "USB-001", quantity: 100 },
];

export function InventoryPage() {
    const navigate = useNavigate();

    const handleItemClick = (id: string) => {
        navigate(`/inventory/${id}`);
    };

    return (
        <div className="space-y-4">
            <p className="text-slate-600">Click on any item to view details.</p>
            <table className="w-full border-collapse border border-slate-300">
                <thead>
                    <tr className="bg-slate-100">
                        <th className="border border-slate-300 px-4 py-2 text-left">Name</th>
                        <th className="border border-slate-300 px-4 py-2 text-left">SKU</th>
                        <th className="border border-slate-300 px-4 py-2 text-left">Quantity</th>
                    </tr>
                </thead>
                <tbody>
                    {mockItems.map((item) => (
                        <tr
                            key={item.id}
                            onClick={() => handleItemClick(item.id)}
                            className="cursor-pointer hover:bg-indigo-50 transition"
                        >
                            <td className="border border-slate-300 px-4 py-2">{item.name}</td>
                            <td className="border border-slate-300 px-4 py-2">{item.sku}</td>
                            <td className="border border-slate-300 px-4 py-2 text-right">{item.quantity}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
