import React, { useEffect, useMemo, useState } from "react";
import { Plus, Minus, Trash2, RotateCcw } from "lucide-react";

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
  const [lastSaved, setLastSaved] = useState("");

  useEffect(() => {
    localStorage.setItem("inventory-items", JSON.stringify(items));
  }, [items]);

  const summary = useMemo(() => {
    const total = items.reduce((sum, item) => sum + Number(item.total), 0);
    const out = items.reduce((sum, item) => sum + Number(item.out), 0);
    return { total, out, remain: total - out };
  }, [items]);

  const remainColor = (remain) => {
    if (remain <= 20) return "#EF4444";
    if (remain <= 50) return "#F59E0B";
    return "#6F35C5";
  };

  const addItem = () => {
    if (!newName.trim() || !newTotal) return;
    setItems([
      ...items,
      { id: Date.now(), name: newName.trim(), total: Number(newTotal), out: 0 },
    ]);
    setNewName("");
    setNewTotal("");
  };

  const deleteItem = (id) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    setItems(items.filter((item) => item.id !== id));
  };

  const resetAll = () => {
    if (!window.confirm("나간 수량을 모두 0으로 초기화할까요?")) return;
    setItems(items.map((item) => ({ ...item, out: 0 })));
  };

const saveData = () => {
  localStorage.setItem(
    "inventory-items",
    JSON.stringify(items)
  );

  const now = new Date();

  const formatted =
    now.getFullYear() +
    "-" +
    String(now.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(now.getDate()).padStart(2, "0") +
    " " +
    String(now.getHours()).padStart(2, "0") +
    ":" +
    String(now.getMinutes()).padStart(2, "0");

  setLastSaved(formatted);

  alert("저장 완료!");
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
    setItems(items.map((item) => (item.id === id ? { ...item, name: value } : item)));
  };

  const updateTotal = (id, value) => {
    setItems(
      items.map((item) => {
        if (item.id !== id) return item;
        const total = Number(value) || 0;
        return { ...item, total, out: Math.min(item.out, total) };
      })
    );
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <div style={styles.brand}>PAW-PAW MONG</div>
            <h1 style={styles.title}>룰렛 경품 재고 체크</h1>
            <p style={styles.subTitle}>나간 수량만 버튼으로 체크</p>
          </div>

<div
  style={{
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "8px",
  }}
>
  <div
    style={{
      fontSize: "12px",
      color: "#7B8794",
      fontWeight: 700,
    }}
  >
    {lastSaved
      ? `마지막 저장 : ${lastSaved}`
      : "아직 저장 안됨"}
  </div>

  <div
    style={{
      display: "flex",
      gap: "8px",
    }}
  >
    <button
      onClick={saveData}
      style={{
        border: "none",
        background: "#6F35C5",
        color: "#FFFFFF",
        borderRadius: "22px",
        padding: "12px 16px",
        fontSize: "16px",
        fontWeight: 900,
        cursor: "pointer",
      }}
    >
      저장
    </button>

    <button
      onClick={resetAll}
      style={styles.resetButton}
    >
      <RotateCcw size={18} />
      초기화
    </button>
  </div>
</div>

        <div style={styles.summaryGrid}>
          <SummaryCard title="총 수량" value={summary.total} bg="#FFE66B" />
          <SummaryCard title="나간 수량" value={summary.out} bg="#D7B8FF" />
          <SummaryCard title="남은 수량" value={summary.remain} bg="#CFF5DF" />
        </div>

        <div style={styles.addBox}>
          <div style={styles.addTitle}>상품 추가</div>
          <div style={styles.addGrid}>
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="상품명"
              style={styles.input}
            />
            <input
              type="number"
              value={newTotal}
              onChange={(e) => setNewTotal(e.target.value)}
              placeholder="수량"
              style={styles.input}
            />
            <button onClick={addItem} style={styles.addButton}>
              등록
            </button>
          </div>
        </div>

        <div style={styles.itemList}>
          {items.map((item) => {
            const remain = item.total - item.out;

            return (
              <div key={item.id} style={styles.itemCard}>
                <div style={styles.itemHeader}>
                  <div style={{ flex: 1 }}>
                    <input
                      value={item.name}
                      onChange={(e) => updateName(item.id, e.target.value)}
                      style={styles.nameInput}
                    />

                    <div style={styles.totalRow}>
                      <span>총</span>
                      <input
                        type="number"
                        value={item.total}
                        onChange={(e) => updateTotal(item.id, e.target.value)}
                        style={styles.totalInput}
                      />
                      <span>개</span>
                    </div>
                  </div>

                  <div style={styles.badgeArea}>
                    <div style={{ ...styles.remainBadge, color: remainColor(remain) }}>
                      남음 {remain}
                    </div>

                    <button onClick={() => deleteItem(item.id)} style={styles.deleteButton}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <div style={styles.counterRow}>
                  <button onClick={() => updateOut(item.id, -1)} style={styles.minusButton}>
                    <Minus size={30} />
                  </button>

                  <div style={styles.outBox}>
                    <div style={styles.outLabel}>나간 수량</div>
                    <div style={styles.outNumber}>{item.out}</div>
                  </div>

                  <button onClick={() => updateOut(item.id, 1)} style={styles.plusButton}>
                    <Plus size={34} />
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

function SummaryCard({ title, value, bg }) {
  return (
    <div style={{ ...styles.summaryCard, background: bg }}>
      <div style={styles.summaryTitle}>{title}</div>
      <div style={styles.summaryValue}>{value}</div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#F3ECFF",
    padding: "24px 14px",
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    color: "#241138",
  },
  container: {
    maxWidth: "720px",
    margin: "0 auto",
    background: "#FFFFFF",
    borderRadius: "32px",
    padding: "28px",
    boxShadow: "0 18px 45px rgba(92, 50, 150, 0.14)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "16px",
    marginBottom: "26px",
  },
  brand: {
    fontSize: "18px",
    fontWeight: 900,
    color: "#6F35C5",
    letterSpacing: "0.5px",
    marginBottom: "8px",
  },
  title: {
    fontSize: "34px",
    lineHeight: 1.15,
    margin: 0,
    fontWeight: 900,
  },
  subTitle: {
    margin: "10px 0 0",
    color: "#7B8794",
    fontSize: "17px",
    fontWeight: 600,
  },
  resetButton: {
    border: "none",
    background: "#F0E5FF",
    color: "#6F35C5",
    borderRadius: "22px",
    padding: "12px 16px",
    fontSize: "16px",
    fontWeight: 900,
    display: "flex",
    alignItems: "center",
    gap: "6px",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "12px",
    marginBottom: "24px",
  },
  summaryCard: {
    borderRadius: "22px",
    padding: "18px 10px",
    textAlign: "center",
  },
  summaryTitle: {
    fontSize: "16px",
    fontWeight: 900,
    marginBottom: "8px",
  },
  summaryValue: {
    fontSize: "32px",
    fontWeight: 900,
    lineHeight: 1,
  },
  addBox: {
    background: "#FAF7FF",
    borderRadius: "22px",
    padding: "16px",
    marginBottom: "22px",
    border: "1px solid #EFE7FA",
  },
  addTitle: {
    fontSize: "16px",
    fontWeight: 900,
    marginBottom: "10px",
  },
  addGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 100px 100px",
    gap: "8px",
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    border: "1px solid #E8DDF5",
    background: "#FFFFFF",
    borderRadius: "14px",
    padding: "12px",
    fontSize: "15px",
    fontWeight: 700,
    outline: "none",
  },
  addButton: {
    border: "none",
    borderRadius: "14px",
    background: "#6F35C5",
    color: "white",
    fontWeight: 900,
    fontSize: "15px",
    cursor: "pointer",
  },
  itemList: {
    display: "grid",
    gap: "16px",
  },
  itemCard: {
    background: "#FCFAFF",
    borderRadius: "24px",
    padding: "18px",
    border: "1px solid #EFEAF7",
    boxShadow: "0 6px 18px rgba(36, 17, 56, 0.07)",
  },
  itemHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    alignItems: "flex-start",
    marginBottom: "12px",
  },
  nameInput: {
    width: "100%",
    border: "none",
    background: "transparent",
    color: "#241138",
    fontSize: "19px",
    fontWeight: 900,
    outline: "none",
  },
  totalRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginTop: "8px",
    color: "#7B8794",
    fontWeight: 700,
  },
  totalInput: {
    width: "74px",
    border: "none",
    background: "#F5F1FA",
    borderRadius: "10px",
    padding: "6px 8px",
    fontSize: "15px",
    fontWeight: 900,
    color: "#241138",
    outline: "none",
  },
  badgeArea: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
  },
  remainBadge: {
    background: "#FFFFFF",
    borderRadius: "999px",
    padding: "9px 14px",
    fontSize: "18px",
    fontWeight: 900,
    whiteSpace: "nowrap",
  },
  deleteButton: {
    border: "none",
    background: "#FFF0F0",
    color: "#EF4444",
    width: "38px",
    height: "38px",
    borderRadius: "14px",
    display: "grid",
    placeItems: "center",
    cursor: "pointer",
  },
  counterRow: {
    display: "grid",
    gridTemplateColumns: "78px 1fr 78px",
    gap: "14px",
    alignItems: "center",
  },
  minusButton: {
    border: "none",
    background: "#F0F0F3",
    color: "#241138",
    height: "72px",
    borderRadius: "22px",
    display: "grid",
    placeItems: "center",
    cursor: "pointer",
  },
  plusButton: {
    border: "none",
    background: "#6F35C5",
    color: "#FFFFFF",
    height: "72px",
    borderRadius: "22px",
    display: "grid",
    placeItems: "center",
    cursor: "pointer",
  },
  outBox: {
    background: "#FFFFFF",
    borderRadius: "22px",
    padding: "14px 10px",
    textAlign: "center",
  },
  outLabel: {
    color: "#9AA4B2",
    fontSize: "15px",
    fontWeight: 800,
    marginBottom: "3px",
  },
  outNumber: {
    fontSize: "34px",
    fontWeight: 900,
    lineHeight: 1,
  },
};
