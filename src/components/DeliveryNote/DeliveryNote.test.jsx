import "@testing-library/jest-dom/vitest";
import DeliveryNote from "./DeliveryNote.jsx";
import { afterEach, describe, expect, it, test, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { useLocation } from "react-router-dom";
import { useEmployeeContext } from "../../context/EmployeeContext.jsx";

vi.mock("react-secure-storage", () => ({
  SecureLocalStorage: vi.fn(() => ({
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
  })),
}));

vi.mock("react-router-dom", () => ({
  ...vi.importActual("react-router-dom"), // Retain other functionality
  useLocation: vi.fn(),
  useNavigate: vi.fn(),
}));

vi.mock("../../context/EmployeeContext.jsx", () => ({
  useEmployeeContext: vi.fn(), // Mock useEmployeeContext
}));

const mockFilteredData = [
  {
    barcode: "38437005901262",
    description: "TEST ARTICLE",
    time: {
      seconds: 1732662000,
      nanoseconds: 0,
    },
    unitsBilled: 120,
    incidents: false,
    checkedby: "",
    checked: false,
    unitsReceived: 0,
    notes: "",
    code: "13055",
  }
];

describe("DeliveryNote", () => {
  it("should render component"),
    () => {
      render(<DeliveryNote />);
      const container = screen.getByRole("region", { name: /delivery note/i });
      expect(container).toBeInTheDocument();
    };

  it("renders buttons for each delivery item", () => {
    useLocation.mockReturnValue({
      pathname: "/delivery-note",
      state: { reviewFileNumber: "12345" },
      search: "",
      hash: "",
    });

    useEmployeeContext.mockReturnValue({
      employee: { id: 1, name: "Tester", admin: true }, // Mocked employee data
    });

    render(<DeliveryNote data={mockFilteredData} />);
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(6);
  });
});
