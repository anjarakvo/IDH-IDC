import { renderHook, act } from "@testing-library/react";
import UserState from "../user";

describe("UserState", () => {
  it("should initialize with the correct default state", () => {
    const { result } = renderHook(() => UserState.useState());
    const { id, fullname, email, active, organisation_detail } = result.current;

    expect(id).toBe(null);
    expect(fullname).toBe(null);
    expect(email).toBe(null);
    expect(active).toBe(0);
    expect(organisation_detail).toEqual({
      id: null,
      name: null,
    });
  });

  it("should updating the state correctly", () => {
    const { result } = renderHook(() => UserState.useState());
    act(() => {
      UserState.update((s) => {
        s.id = 1;
        s.fullname = "John Doe";
        s.email = "test@test.com";
        s.active = 1;
        s.organisation_detail = {
          id: 1,
          name: "Akvo",
        };
      });
    });
    const { id, fullname, email, active, organisation_detail } = result.current;

    expect(id).toBe(1);
    expect(fullname).toBe("John Doe");
    expect(email).toBe("test@test.com");
    expect(active).toBe(1);
    expect(organisation_detail).toEqual({
      id: 1,
      name: "Akvo",
    });
  });
});
