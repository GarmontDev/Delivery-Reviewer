import { afterEach, describe, expect, it, test, vi } from "vitest";
import FilesListTable from "./FilesListTable";
import { cleanup, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { useEmployeeContext } from "../../../context/EmployeeContext";

vi.mock("react-secure-storage", () => ({
  SecureLocalStorage: vi.fn(() => ({
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
  })),
}));

vi.mock("../../../context/EmployeeContext", () => ({
  useEmployeeContext: vi.fn(),
}));

const mockFiles = [
  {
    number: "12345",
    createdDate: { seconds: 1672531200 },
    completed: false,
    incidents: true,
    description: "Test File Description",
    visible: true,
  },
];

// Mock handlers
const mockHandleDeliveryFile = vi.fn();
const mockHandleUpdateCompleted = vi.fn();
const mockHandleDeleteFile = vi.fn();
const mockHandleListAllFiles = vi.fn();

describe("List of files", () => {
  useEmployeeContext.mockReturnValue({
    employee: { id: 1, name: "Tester", admin: true }, // Mocked employee data
  });

  it("should render component"), () => {
      render(<FilesListTable />);
  };

  it("should render with no files availables", () => {
    render(<FilesListTable />);
    screen.getByText("No hay albaranes disponibles");
  });

  it("should render file description", () => {
    render(
      <FilesListTable
        filteredFiles={mockFiles}
        showVisibleFiles={true}
        handleListAllFiles={mockHandleListAllFiles}
        handleDeliveryFile={mockHandleDeliveryFile}
        handleUpdateCompleted={mockHandleUpdateCompleted}
        handleDeleteFile={mockHandleDeleteFile}
      />
    );
    const fileDescription = screen.getByText("Test File Description");
    expect(fileDescription).toBeInTheDocument();
  });
});
