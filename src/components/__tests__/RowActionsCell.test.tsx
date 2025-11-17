import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { RowActionsCell } from '../RowActionsCell';

const mockItem = { id: 1, name: 'Test User' };
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
  },
];

describe('RowActionsCell', () => {
  it('renders action button when actions are provided', () => {
    const buttonRef = React.createRef<HTMLButtonElement | null>();
    const onMenuToggle = jest.fn();

    render(
      <RowActionsCell
        item={mockItem}
        index={0}
        actions={mockActions}
        onMenuToggle={onMenuToggle}
        isMenuOpen={false}
        buttonRef={buttonRef}
      />
    );

    const button = screen.getByLabelText('Row actions');
    expect(button).toBeInTheDocument();
  });

  it('calls onMenuToggle when button is clicked', () => {
    const buttonRef = React.createRef<HTMLButtonElement | null>();
    const onMenuToggle = jest.fn();

    render(
      <RowActionsCell
        item={mockItem}
        index={0}
        actions={mockActions}
        onMenuToggle={onMenuToggle}
        isMenuOpen={false}
        buttonRef={buttonRef}
      />
    );

    const button = screen.getByLabelText('Row actions');
    fireEvent.click(button);

    expect(onMenuToggle).toHaveBeenCalledWith(mockItem, 0);
  });

  it('stops propagation on click', () => {
    const buttonRef = React.createRef<HTMLButtonElement | null>();
    const onMenuToggle = jest.fn();
    const handleRowClick = jest.fn();

    render(
      <tr onClick={handleRowClick}>
        <RowActionsCell
          item={mockItem}
          index={0}
          actions={mockActions}
          onMenuToggle={onMenuToggle}
          isMenuOpen={false}
          buttonRef={buttonRef}
        />
      </tr>
    );

    const button = screen.getByLabelText('Row actions');
    fireEvent.click(button);

    // Row click should not be triggered
    expect(handleRowClick).not.toHaveBeenCalled();
  });

  it('applies active class when menu is open', () => {
    const buttonRef = React.createRef<HTMLButtonElement | null>();
    const onMenuToggle = jest.fn();

    render(
      <RowActionsCell
        item={mockItem}
        index={0}
        actions={mockActions}
        onMenuToggle={onMenuToggle}
        isMenuOpen={true}
        buttonRef={buttonRef}
      />
    );

    const button = screen.getByLabelText('Row actions');
    expect(button).toHaveClass('hh-row-actions-button-active');
  });

  it('renders empty cell when no actions provided', () => {
    const buttonRef = React.createRef<HTMLButtonElement | null>();
    const onMenuToggle = jest.fn();

    render(
      <RowActionsCell
        item={mockItem}
        index={0}
        actions={[]}
        onMenuToggle={onMenuToggle}
        isMenuOpen={false}
        buttonRef={buttonRef}
      />
    );

    const button = screen.queryByLabelText('Row actions');
    expect(button).not.toBeInTheDocument();
  });

  it('has correct aria attributes', () => {
    const buttonRef = React.createRef<HTMLButtonElement | null>();
    const onMenuToggle = jest.fn();

    render(
      <RowActionsCell
        item={mockItem}
        index={0}
        actions={mockActions}
        onMenuToggle={onMenuToggle}
        isMenuOpen={true}
        buttonRef={buttonRef}
      />
    );

    const button = screen.getByLabelText('Row actions');
    expect(button).toHaveAttribute('aria-haspopup', 'true');
    expect(button).toHaveAttribute('aria-expanded', 'true');
  });
});

