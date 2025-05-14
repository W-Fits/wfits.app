import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ItemUpload } from "@/components/upload/item-upload";
import { Session } from "next-auth";
import * as hooks from "@/lib/hooks/use-persistent-state";
import * as React from "react";

const mockSession: Session = {
  user: {
    id: 1,
    name: "Test User",
    email: "test@example.com",
    image: ''
  },
  expires: "9999-12-31T23:59:59.999Z",
};

jest.spyOn(hooks, "usePersistentState").mockImplementation((key, defaultValue) => {
  const [state, setState] = React.useState(defaultValue);
  const clear = () => setState(defaultValue);
  return [state, setState, clear];
});

describe("ItemUpload Component", () => {
  it("should allow changing the category select value", async () => {
    render(<ItemUpload session={mockSession} />);
    const user = userEvent.setup();

    const categorySelect = await screen.findByRole("combobox", { name: /category/i });
    await user.selectOptions(categorySelect, "2");
    expect((categorySelect as HTMLSelectElement).value).toBe("2");
  });
});
