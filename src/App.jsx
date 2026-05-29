```jsx
import React, { useEffect, useMemo, useState } from "react";
import { Plus, Minus, Trash2 } from "lucide-react";

const defaultItems = [
  {
    id: 1,
    name: "포포몽 도톰한 에센셜 케어 펫티슈",
    total: 120,
    out: 0,
  },
  {
    id: 2,
    name: "포포몽 푸푸백 1롤",
    total: 320,
    out: 0,
  },
  {
    id: 3,
    name: "포포몽 어베니 이어클리너",
    total: 20,
    out: 0,
  },
  {
    id: 4,
    name: "포포몽 딥 클린 효소 치약 치즈향",
    total: 20,
    out: 0,
  },
  {
    id: 5,
    name: "포포몽 7+ 덴탈 스프레이 바닐라향",
    total: 20,
    out: 0,
  },
  {
    id: 6,
    name: "포포몽 컴포트 그루밍 미스트",
    total: 20,
    out: 0,
  },
  {
    id: 7,
    name: "포포몽 쿨링 미스트",
    total: 20,
    out: 0,
  },
  {
    id: 8,
    name: "포포몽 배리어 크림",
    total: 20,
    out: 0,
  },
  {
    id: 9,
    name: "포포몽 배리어 앰플",
    total: 20,
    out: 0,
  },
  {
    id: 10,
    name: "포포몽 말랑 실리콘 보틀",
    total: 20,
    out: 0,
  },
];

export default function App() {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem("inventory-items");
    return saved ? JSON.parse(saved) : defaultItems;
  });

  const [newName, setNewName] = useState("");
  const [newTotal, setNewTotal] = useState("");

  useEffect(() => {
    localStorage.setItem("inventory-items", JSON.stringify(items));
  }, [items]);

  const summary = useMemo(() => {
    const total = items.reduce((sum, item) => sum + Number(item.total), 0);
    const out = items.reduce((sum, item) => sum + Number(item.out), 0);

    return {
      total,
      out,
      remain: total - out,
    };
  }, [items]);

  const updateOut = (id, delta) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        const next = Math.max(
          0,
          Math.min(item.total, item.out + delta)
        );

        return {
          ...item,
          out: next,
        };
      })
    );
  };

  const updateField = (id, field, value) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]:
                field === "name"
                  ? value
                  : Number(value),
            }
          : item
      )
    );
  };

  const deleteItem = (id) => {
    setItems((prev) =>
      prev.filter((item) => item.id !== id)
    );
  };

  const addItem = () => {
    if (!newName || !newTotal) return;

    const newItem = {
      id: Date.now(),
      name: newName,
      total: Number(newTotal),
      out: 0,
    };

    setItems((prev) => [...prev, newItem]);

    setNewName("");
    setNewTotal("");
  };

  return (
    <div className="min-h-screen bg-[#F5EEFF] p-4">
      <div className="mx-auto max-w-md rounded-3xl bg-white p-4 shadow-xl">

        <h1 className="mb-4 text-2xl font-black text-[#5D2CA8]">
          포포몽 룰렛 재고관리
        </h1>

        <div className="mb-5 grid grid-cols-3 gap-2">
          <div className="rounded-2xl bg-yellow-200 p-3 text-center">
            <p className="text-xs font-bold">총 수량</p>
            <p className="text-xl font-black">{summary.total}</p>
          </div>

          <div className="rounded-2xl bg-purple-200 p-3 text-center">
            <p className="text-xs font-bold">나간 수량</p>
            <p className="text-xl font-black">{summary.out}</p>
          </div>

          <div className="rounded-2xl bg-green-200 p-3 text-center">
            <p className="text-xs font-bold">남은 수량</p>
            <p className="text-xl font-black">{summary.remain}</p>
          </div>
        </div>

        <div className="mb-6 rounded-2xl bg-[#F8F5FF] p-3">
          <p className="mb-2 text-sm font-bold">
            상품 추가
          </p>

          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="상품 이름"
            className="mb-2 w-full rounded-xl border p-3"
          />

          <input
            value={newTotal}
            type="number"
            onChange={(e) => setNewTotal(e.target.value)}
            placeholder="총 수량"
            className="mb-2 w-full rounded-xl border p-3"
          />

          <button
            onClick={addItem}
            className="w-full rounded-xl bg-[#5D2CA8] p-3 font-bold text-white"
          >
            상품 등록
          </button>
        </div>

        <div className="space-y-3">
          {items.map((item) => {
            const remain = item.total - item.out;

            return (
              <div
                key={item.id}
                className="rounded-2xl border bg-[#FCFBFF] p-3"
              >

                <div className="mb-2 flex justify-between gap-2">

                  <input
                    value={item.name}
                    onChange={(e) =>
                      updateField(
                        item.id,
                        "name",
                        e.target.value
                      )
                    }
                    className="flex-1 rounded-xl border p-2 font-bold"
                  />

                  <button
                    onClick={() => deleteItem(item.id)}
                    className="rounded-xl bg-red-100 p-3 text-red-500"
                  >
                    <Trash2 size={18} />
                  </button>

                </div>

                <div className="mb-3 grid grid-cols-3 gap-2 text-center">

                  <div className="rounded-xl bg-gray-100 p-2">
                    <p className="text-xs">총 재고</p>

                    <input
                      type="number"
                      value={item.total}
                      onChange={(e) =>
                        updateField(
                          item.id,
                          "total",
                          e.target.value
                        )
                      }
                      className="w-full bg-transparent text-center text-lg font-black"
                    />
                  </div>

                  <div className="rounded-xl bg-purple-100 p-2">
                    <p className="text-xs">나감</p>
                    <p className="text-lg font-black">
                      {item.out}
                    </p>
                  </div>

                  <div className="rounded-xl bg-green-100 p-2">
                    <p className="text-xs">남음</p>
                    <p className="text-lg font-black">
                      {remain}
                    </p>
                  </div>

                </div>

                <div className="flex gap-2">

                  <button
                    onClick={() =>
                      updateOut(item.id, -1)
                    }
                    className="flex-1 rounded-2xl bg-gray-200 p-4"
                  >
                    <Minus className="mx-auto" />
                  </button>

                  <button
                    onClick={() =>
                      updateOut(item.id, 1)
                    }
                    className="flex-1 rounded-2xl bg-[#5D2CA8] p-4 text-white"
                  >
                    <Plus className="mx-auto" />
                  </button>

                </div>

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
```
