import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RowActionsMenu } from '../RowActionsMenu';

// Mock data
const mockItem = { id: 1, name: 'Test User', email: 'test@example.com' };
const mockActions = [
  {
    key: 'edit',
    label: 'Edit',
    onClick: jest.fn(),
  },
  {
    key: 'delete',
    label: 'Delete',
    onClick: jest.fn(),
    disabled: false,
  },
  {
    key: 'disabled-action',
    label: 'Disabled Action',
    onClick: jest.fn(),
    disabled: true,
  },
];

describe('RowActionsMenu', () => {
  let anchorRef: React.RefObject<HTMLButtonElement>;

  beforeEach(() => {
    anchorRef = React.createRef<HTMLButtonElement>();
    // Create a mock button element
    const button = document.createElement('button');
    button.getBoundingClientRect = jest.fn(() => ({
      top: 100,
      bottom: 132,
      left: 500,
      right: 532,
      width: 32,
      height: 32,
      x: 500,
      y: 100,
      toJSON: jest.fn(),
    }));
    anchorRef.current = button;
  });

  it('renders menu with actions', () => {
    render(
      <RowActionsMenu
        anchorRef={anchorRef}
        actions={mockActions}
        item={mockItem}
        index={0}
        onDismiss={jest.fn()}
      />
    );

    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
    expect(screen.getByText('Disabled Action')).toBeInTheDocument();
  });

  it('calls onClick when action is clicked', () => {
    const editAction = mockActions[0];
    render(
      <RowActionsMenu
        anchorRef={anchorRef}
        actions={mockActions}
        item={mockItem}
        index={0}
        onDismiss={jest.fn()}
      />
    );

    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);

    expect(editAction.onClick).toHaveBeenCalledWith(mockItem, 0);
  });

  it('calls onDismiss when action is clicked', () => {
    const onDismiss = jest.fn();
    render(
      <RowActionsMenu
        anchorRef={anchorRef}
        actions={mockActions}
        item={mockItem}
        index={0}
        onDismiss={onDismiss}
      />
    );

    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);

    expect(onDismiss).toHaveBeenCalled();
  });

  it('disables disabled actions', () => {
    render(
      <RowActionsMenu
        anchorRef={anchorRef}
        actions={mockActions}
        item={mockItem}
        index={0}
        onDismiss={jest.fn()}
      />
    );

    const disabledButton = screen.getByText('Disabled Action');
    expect(disabledButton).toBeDisabled();
  });

  it('does not call onClick for disabled actions', () => {
    const disabledAction = mockActions[2];
    render(
      <RowActionsMenu
        anchorRef={anchorRef}
        actions={mockActions}
        item={mockItem}
        index={0}
        onDismiss={jest.fn()}
      />
    );

    const disabledButton = screen.getByText('Disabled Action');
    fireEvent.click(disabledButton);

    expect(disabledAction.onClick).not.toHaveBeenCalled();
  });

  it('closes menu when clicking outside', async () => {
    const onDismiss = jest.fn();
    render(
      <div>
        <RowActionsMenu
          anchorRef={anchorRef}
          actions={mockActions}
          item={mockItem}
          index={0}
          onDismiss={onDismiss}
        />
        <div data-testid="outside">Outside</div>
      </div>
    );

    const outsideElement = screen.getByTestId('outside');
    fireEvent.mouseDown(outsideElement);

    await waitFor(() => {
      expect(onDismiss).toHaveBeenCalled();
    });
  });

  it('closes menu when pressing Escape', () => {
    const onDismiss = jest.fn();
    render(
      <RowActionsMenu
        anchorRef={anchorRef}
        actions={mockActions}
        item={mockItem}
        index={0}
        onDismiss={onDismiss}
      />
    );

    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });

    expect(onDismiss).toHaveBeenCalled();
  });

  it('does not render when anchorRef is null', () => {
    const nullRef = React.createRef<HTMLButtonElement>();
    const { container } = render(
      <RowActionsMenu
        anchorRef={nullRef}
        actions={mockActions}
        item={mockItem}
        index={0}
        onDismiss={jest.fn()}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('does not render when actions array is empty', () => {
    const { container } = render(
      <RowActionsMenu
        anchorRef={anchorRef}
        actions={[]}
        item={mockItem}
        index={0}
        onDismiss={jest.fn()}
      />
    );

    expect(container.firstChild).toBeNull();
  });
});

