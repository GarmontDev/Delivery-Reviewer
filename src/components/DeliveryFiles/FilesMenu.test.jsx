import { render, screen } from '@testing-library/react'
import FilesMenu from "./FilesMenu"
import { describe, expect, it, vi} from 'vitest'
import { useNavigate } from 'react-router-dom';

const mockedUseNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const mod = await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom"
  );
  return {
    ...mod,
    useNavigate: () => mockedUseNavigate,
  };
});

const employee = {name: "TestEmployee", admin: false}

describe('FilesMenu', () => {

  it('renders employee name appropriately', () => {
    render(<FilesMenu employee={employee} showVisibleFiles={true} />)
    expect(screen.getByText("TestEmployee")).toBeTruthy()
  })
 })