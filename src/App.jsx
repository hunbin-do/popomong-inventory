import React, { useEffect, useMemo, useState } from "react";
import { Plus, Minus, Trash2 } from "lucide-react";

const defaultItems = [
  { id: 1, name: "포포몽 도톰한 에센셜 케어 펫티슈", total: 120, out: 0 },
  { id: 2, name: "포포몽 푸푸백 1롤", total: 320, out: 0 },
  { id: 3, name: "포포몽 어베니 이어클리너", total: 20, out: 0 },
  { id: 4, name: "포포몽 딥 클린 효소 치약 치즈향", total: 20, out: 0 },
  { id: 5, name: "포포몽 7+ 덴탈 스프레이 바닐라향", total: 20, out: 0 },
  { id: 6, name: "포포몽 컴포트 그루밍 미스트", total: 20, out: 0 },
  { id: 7, name: "포포몽 쿨링 미스트", total: 20, out: 0 },
  { id: 8, name: "포포몽 배리어 크림", total: 20, out: 0 },
  { id: 9, name: "포포몽 배리어 앰플", total: 20, out: 0 },
  { id: 10, name: "포포몽 말랑 실리콘 보틀", total: 20, out: 0 },
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
    const total = items.reduce((sum, item) => sum + item.total, 0);
    const out = items.reduce((sum, item) => sum + item.out, 0);

    return {
      total,
      out,
      remain: total - out,
    };
  }, [items]);

  const addItem = () => {
    if (!newName || !newTotal) return;

    setItems([
      ...items,
      {
        id: Date.now(),
        name: newName,
        total: Number(newTotal),
        out: 0,
      },
    ]);

    setNewName("");
    setNewTotal("");
  };

  const deleteItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const updateOut = (id, change) => {
    setItems(
      items.map((item) => {
        if (item.id !== id) return item;

        const nextOut = Math.max(
          0,
          Math.min(item.total, item.out + change)
        );

        return {
          ...item,
          out: nextOut,
        };
      })
    );
  };

  const updateName = (id, value) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, name: value } : item
      )
    );
  };

  const updateTotal = (id, value) => {
    setItems(
      items.map((item) =>
        item.id === id
          ? { ...item, total: Number(value) || 0 }
          : item
      )
    );
  };

  return (
    <div style={{ padding: "20px", maxWidth: "700px", margin: "0 auto" }}>
      <h1>포포몽 룰렛 재고관리</h1>

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        <div>총 수량: {summary.total}</div>
        <div>나간 수량: {summary.out}</div>
        <div>남은 수량: {summary.remain}</div>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <input
          placeholder="상품명"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />

        <input
          type="number"
          placeholder="수량"
          value={newTotal}
          onChange={(e) => setNewTotal(e.target.value)}
        />

        <button onClick={addItem}>상품 추가</button>
      </div>

      {items.map((item) => {
        const remain = item.total - item.out;

        return (
          <div
            key={item.id}
            style={{
              border: "1px solid #ddd",
              padding: "12px",
              marginBottom: "12px",
              borderRadius: "8px",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "10px",
                marginBottom: "10px",
              }}
            >
              <input
                value={item.name}
                onChange={(e) =>
                  updateName(item.id, e.target.value)
                }
              />

              <button
                onClick={() => deleteItem(item.id)}
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div
              style={{
                display: "flex",
                gap: "20px",
                marginBottom: "10px",
              }}
            >
              <div>
                총 재고
                <input
                  type="number"
                  value={item.total}
                  onChange={(e) =>
                    updateTotal(item.id, e.target.value)
                  }
                />
              </div>

              <div>나감: {item.out}</div>
              <div>남음: {remain}</div>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() =>
                  updateOut(item.id, -1)
                }
              >
                <Minus size={18} />
              </button>

              <button
                onClick={() =>
                  updateOut(item.id, 1)
                }
              >
                <Plus size={18} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
