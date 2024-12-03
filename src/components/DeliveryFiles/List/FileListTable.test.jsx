import { afterEach, describe, expect, it, test, vi } from "vitest";
import FilesListTable from "./FilesListTable";
import { cleanup, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

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
const mockUpdateReviewed = vi.fn();
const mockHandleDeleteFile = vi.fn();
const mockHandleListAllFiles = vi.fn();

const employee = { name: "Tester", admin: true };

describe("List of files", () => {
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
        employee={employee}
        filteredFiles={mockFiles}
        showVisibleFiles={true}
        handleListAllFiles={mockHandleListAllFiles}
        handleDeliveryFile={mockHandleDeliveryFile}
        handleUpdateCompleted={mockHandleUpdateCompleted}
        handleUpdateReviewed={mockUpdateReviewed}
        handleDeleteFile={mockHandleDeleteFile}
      />
    );
    const fileDescription = screen.getByText("Test File Description");
    expect(fileDescription).toBeInTheDocument();
  });
});
