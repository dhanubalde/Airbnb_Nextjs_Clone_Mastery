'use client';

interface MenuItemProps {
  onClick: () => void;
  label: string;
  selected?: boolean;
}
const MenuItem: React.FC<MenuItemProps> = ({ onClick, label, selected }) => {
  return (
    <div
      onClick={onClick}
      className="px-4 py-3 hover:bg-neutral-100 font-semibold text-[13px] "
    >
      {label}
    </div>
  );
};

export default MenuItem;
