import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

const assets = "/assets";

type Meal = "Breakfast" | "Lunch" | "Dinner";

type MenuItem = {
  name: string;
  tags: string[];
};

type Station = {
  name: string;
  items: MenuItem[];
};

type Hall = {
  name: string;
  stations: Station[];
};

const halls: Hall[] = [
  {
    name: "1920 COMMONS",
    stations: [
      {
        name: "Kettles",
        items: [{ name: "Moroccan Style Chickpea Stew", tags: ["V"] }],
      },
      {
        name: "Comfort",
        items: [
          { name: "Cilantro lime rice", tags: ["V"] },
          { name: "Oven roasted squash blend", tags: ["V"] },
        ],
      },
      {
        name: "Simply Oasis",
        items: [
          { name: "White rice", tags: ["V"] },
          { name: "Sauteed zucchini and spinach", tags: ["V"] },
        ],
      },
      {
        name: "Global Garden Toppings",
        items: [
          { name: "Monsoon kitchens cilantro chutney", tags: ["V"] },
          { name: "Cucumber yogurt raita", tags: ["VG", "J"] },
          { name: "Cilantro leaves", tags: ["V", "J"] },
          { name: "Sliced cucumber", tags: ["V", "J"] },
          { name: "Sliced fresh jalapenos", tags: ["V"] },
        ],
      },
      {
        name: "Global Garden",
        items: [
          { name: "Monsoon kitchens roti", tags: ["V", "J"] },
          { name: "Steamed basmati rice", tags: ["V", "J"] },
          { name: "Vegetable and butternut squash korma", tags: ["V", "J"] },
        ],
      },
      {
        name: "EXPO",
        items: [
          { name: "Eggs for omelet", tags: ["VG"] },
          { name: "Cherry tomatoes", tags: ["V"] },
          { name: "Shredded cheddar cheese", tags: ["VG"] },
          { name: "Sliced american cheese", tags: ["VG"] },
          { name: "Diced red bell peppers", tags: ["V"] },
          { name: "Diced onion", tags: ["V"] },
          { name: "Baby spinach", tags: ["V"] },
          { name: "Sliced mushrooms", tags: ["V"] },
          { name: "Hash brown patty", tags: ["V", "WHEAT"] },
        ],
      },
      {
        name: "EXPO TOPPINGS",
        items: [{ name: "Buttermilk biscuit", tags: ["VG", "EGG"] }],
      },
      {
        name: "PIZZA",
        items: [
          { name: "Classic cheese pizza", tags: ["VG", "MILK"] },
          { name: "Spinach and mushroom pizza", tags: ["V", "MILK"] },
        ],
      },
      {
        name: "GRILL",
        items: [
          { name: "1920 House-spiced tater tots", tags: ["V"] },
          { name: "Old bay fries", tags: ["V"] },
        ],
      },
      {
        name: "FRUIT AND YOGURT",
        items: [
          { name: "Flavored yogurt", tags: ["VG"] },
          { name: "Fresh cut fruit", tags: ["V"] },
          { name: "Oats and honey granola", tags: ["V"] },
        ],
      },
      {
        name: "SWEETS AND TREATS",
        items: [{ name: "Assorted desserts", tags: ["VG"] }],
      },
    ],
  },
  {
    name: "HILL HOUSE",
    stations: [
      {
        name: "Kettles",
        items: [{ name: "Ginger carrot soup", tags: ["V"] }],
      },
      {
        name: "Pennsburg Grill",
        items: [
          { name: "Sauteed mushrooms", tags: ["V"] },
          { name: "Sauteed onions", tags: ["V"] },
          { name: "Sauteed peppers", tags: ["V"] },
          { name: "Curly fries", tags: ["V"] },
        ],
      },
      {
        name: "Smoque'd Deli",
        items: [
          { name: "Grilled eggplant caprese sandwich", tags: ["V"] },
          { name: "Pickle spear", tags: ["V"] },
          { name: "Grapes", tags: ["V"] },
        ],
      },
      {
        name: "Vegan",
        items: [
          { name: 'Seared tofu "steak" with balsamic glazed mushrooms', tags: ["V", "BEAN"] },
          { name: "Scallion rice noodles", tags: ["V"] },
          { name: "Roasted mushrooms and carrots", tags: ["V"] },
        ],
      },
    ],
  },
  { name: "ENGLISH HOUSE", stations: [] },
  { name: "FALK KOSHER DINING", stations: [] },
  { name: "LAUDER COLLEGE HOUSE", stations: [] },
  { name: "QUAKER KITCHEN", stations: [] },
  { name: "1920 GOURMET GROCER", stations: [] },
];

const tabs = [
  "All",
  "1920 Commons",
  "Hill House",
  "English House",
  "Falk Kosher",
  "Lauder College House",
  "Quaker Kitchen",
];

const showOnly = ["Vegetarian", "Halal", "Vegan", "Kosher", "Gluten-free", "Jain"];
const exclude = [
  "Peanut",
  "Milk",
  "Tree Nut",
  "Egg",
  "Sesame",
  "Soy",
  "Fish",
  "Shellfish",
  "Wheat/Gluten",
];

function Icon({
  name,
  className = "",
  alt = "",
}: {
  name: string;
  className?: string;
  alt?: string;
}) {
  return <img alt={alt} className={className} src={`${assets}/${name}`} />;
}

function SearchIcon() {
  return <Icon className="search-icon" name="92fb4.svg" />;
}

function BottomNav({ hidden = false }: { hidden?: boolean }) {
  return (
    <nav aria-hidden={hidden} className={hidden ? "bottom-nav hidden" : "bottom-nav"} aria-label="Main navigation">
      {[
        ["2dc74.svg", "Home"],
        ["225ba.svg", "Dining"],
        ["b5455.svg", "GSR"],
        ["d58f2.svg", "Laundry"],
      ].map(([icon, label]) => (
        <button className={label === "Dining" ? "active" : ""} key={label} type="button">
          <span className="nav-icon">
            <Icon name={icon} />
          </span>
          <span>{label}</span>
        </button>
      ))}
      <button type="button">
        <span className="nav-icon more-icon">
          <Icon name="26e62.svg" />
          <Icon name="26e62.svg" />
          <Icon name="26e62.svg" />
        </span>
        <span>More</span>
      </button>
    </nav>
  );
}

function DiningHome({ onSearch }: { onSearch: (withFilter?: boolean) => void }) {
  return (
    <main className="home-page">
      <section className="home-content">
        <header className="home-header">
          <h1>Dining</h1>
          <div className="balance-heading">
            <span>Dining Balance</span>
            <Icon className="reload-icon" name="e255e.svg" />
          </div>
        </header>

        <section className="balance-grid" aria-label="Dining balance">
          <article>
            <Icon name="b4ddb.svg" />
            <div>
              <strong>$131.15</strong>
              <span>Dining dollars</span>
            </div>
          </article>
          <article>
            <Icon name="ed5ac.svg" />
            <div>
              <strong>107</strong>
              <span>Swipes</span>
            </div>
          </article>
          <article>
            <Icon name="7b59b.svg" />
            <div>
              <strong>10</strong>
              <span>Guest Swipes</span>
            </div>
          </article>
          <button className="analytics-card" type="button">
            <span>Analytics</span>
            <Icon name="fe98c.svg" />
          </button>
        </section>

        <hr className="home-divider" />

        <div className="search-launcher">
          <button className="search-launcher-main" onClick={() => onSearch()} type="button">
            <SearchIcon />
            <span>Search Menus</span>
          </button>
          <button
            aria-label="Filter menus"
            className="search-launcher-filter"
            onClick={() => onSearch(true)}
            type="button"
          >
            <Icon name="filter-sliders.svg" />
          </button>
        </div>

        <section className="favorites">
          <h2>Favorites</h2>
          <button type="button">
            <Icon name="e6ab3.svg" />
            <span>
              Add venue to favorites
              <small>Tap here, or swipe left on a venue</small>
            </span>
          </button>
        </section>

        <section className="dining-halls">
          <h2>Dining Halls</h2>
          {[
            ["1920 Commons", "be003.svg"],
            ["Hill House", "d72ac.svg"],
          ].map(([name, arrow]) => (
            <article key={name}>
              <div className="hall-photo" />
              <div className="hall-summary">
                <small><Icon name="944c9.svg" />Brunch</small>
                <strong>{name}</strong>
                <div><span>10 - 3</span><span>5 - 9:30</span></div>
              </div>
              <Icon name={arrow} />
            </article>
          ))}
        </section>
      </section>

      <BottomNav />
    </main>
  );
}

function CheckOption({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: () => void;
}) {
  return (
    <button className="check-option" onClick={onChange} type="button">
      {checked
        ? <Icon className="checkbox-image" name="b71e7.svg" />
        : <span className="checkbox" />}
      {label}
    </button>
  );
}

const sheetEase = "cubic-bezier(0.32, 0.72, 0, 1)";

function useSheetDrag(onClose: () => void, onDismissStart?: () => void) {
  const [dragY, setDragY] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [closing, setClosing] = useState(false);
  const dragStart = useRef<number | null>(null);
  const dragMoved = useRef(false);
  const lastMove = useRef({ y: 0, time: 0, velocity: 0 });

  const dismiss = () => {
    onDismissStart?.();
    setClosing(true);
    window.setTimeout(onClose, 320);
  };

  const onPointerDown = (event: React.PointerEvent<HTMLElement>) => {
    dragStart.current = event.clientY;
    dragMoved.current = false;
    lastMove.current = { y: event.clientY, time: event.timeStamp, velocity: 0 };
  };

  const onPointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if (dragStart.current === null) return;
    const distance = event.clientY - dragStart.current;
    if (!dragMoved.current && distance > 8) {
      dragMoved.current = true;
      setDragging(true);
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    if (dragMoved.current) setDragY(Math.max(0, distance));
    const elapsed = event.timeStamp - lastMove.current.time;
    if (elapsed > 0) {
      lastMove.current = {
        y: event.clientY,
        time: event.timeStamp,
        velocity: (event.clientY - lastMove.current.y) / elapsed,
      };
    }
  };

  const onPointerUp = () => {
    if (dragMoved.current) {
      const flicked = lastMove.current.velocity > 0.6 && dragY > 30;
      if (dragY > 120 || flicked) dismiss();
      else setDragY(0);
    }
    dragStart.current = null;
    setDragging(false);
  };

  const sheetOffset = closing ? "100%" : `${dragY}px`;
  const overlayOpacity = closing ? 0 : 0.5 * (1 - Math.min(dragY / 400, 1));

  return {
    dismiss,
    layerProps: {
      className: "sheet-layer",
      onClick: dismiss,
      role: "presentation",
      style: {
        background: `rgb(76 76 76 / ${overlayOpacity})`,
        transition: dragging ? "none" : "background 320ms ease",
      },
    },
    sheetProps: {
      onClick: (event: React.MouseEvent) => event.stopPropagation(),
      onClickCapture: (event: React.MouseEvent) => {
        if (dragMoved.current) {
          event.stopPropagation();
          dragMoved.current = false;
        }
      },
      onPointerCancel: onPointerUp,
      onPointerDown,
      onPointerMove,
      onPointerUp,
      style: {
        transform: `translateY(${sheetOffset})`,
        transition: dragging ? "none" : `transform 320ms ${sheetEase}`,
      },
    },
  };
}

function FilterSheet({
  initialMeal,
  initialSelected,
  onClose,
  onDismissStart,
  onSave,
}: {
  initialMeal: Meal;
  initialSelected: string[];
  onClose: () => void;
  onDismissStart: () => void;
  onSave: (meal: Meal, values: string[]) => void;
}) {
  const [meal, setMeal] = useState<Meal>(initialMeal);
  const [selected, setSelected] = useState(initialSelected);

  const toggle = (value: string) => {
    setSelected((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value],
    );
  };

  const { dismiss, layerProps, sheetProps } = useSheetDrag(onClose, onDismissStart);

  return (
    <div {...layerProps}>
      <section
        aria-label="Dining filters"
        aria-modal="true"
        className="filter-sheet"
        role="dialog"
        {...sheetProps}
      >
        <div className="sheet-handle" />
        <h2>Filter</h2>
        <div className="date-row">
          <strong>Date</strong>
          <span>October 9, 2026</span>
        </div>
        <div className="meal-picker">
          <span
            aria-hidden="true"
            className="meal-indicator"
            style={{ transform: `translateX(${(["Breakfast", "Lunch", "Dinner"] as Meal[]).indexOf(meal) * 100}%)` }}
          />
          {(["Breakfast", "Lunch", "Dinner"] as Meal[]).map((option) => (
            <button
              className={meal === option ? "active" : ""}
              key={option}
              onClick={() => setMeal(option)}
              type="button"
            >
              {option}
            </button>
          ))}
        </div>

        <fieldset>
          <legend>Show Only</legend>
          <div className="option-columns">
            {[showOnly.filter((_, index) => index % 2 === 0), showOnly.filter((_, index) => index % 2 === 1)].map((column, index) => (
              <div className="option-column" key={index}>
                {column.map((option) => (
                  <CheckOption
                    checked={selected.includes(option)}
                    key={option}
                    label={option}
                    onChange={() => toggle(option)}
                  />
                ))}
              </div>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend>Exclude</legend>
          <div className="option-columns exclude-columns">
            {[exclude.filter((_, index) => index % 2 === 0), exclude.filter((_, index) => index % 2 === 1)].map((column, index) => (
              <div className="option-column" key={index}>
                {column.map((option) => (
                  <CheckOption
                    checked={selected.includes(option)}
                    key={option}
                    label={option}
                    onChange={() => toggle(option)}
                  />
                ))}
              </div>
            ))}
          </div>
        </fieldset>

        <div className="sheet-actions">
          <button onClick={() => setSelected([])} type="button">Clear</button>
          <button
            onClick={() => {
              onSave(meal, selected);
              dismiss();
            }}
            type="button"
          >
            Save
          </button>
        </div>
      </section>
    </div>
  );
}

function filterLabel(filter: string) {
  return showOnly.includes(filter) ? `Only ${filter}` : filter;
}

function MealDropdown({
  meal,
  setMeal,
}: {
  meal: Meal;
  setMeal: (meal: Meal) => void;
}) {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const closeMenu = (delay = 0) => {
    window.setTimeout(() => setClosing(true), delay);
    window.setTimeout(() => {
      setOpen(false);
      setClosing(false);
    }, delay + 140);
  };

  useEffect(() => {
    if (!open) return;
    const close = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) closeMenu();
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  return (
    <div className="meal-dropdown" ref={ref}>
      <button
        aria-expanded={open}
        aria-haspopup="listbox"
        className={open ? "filter-button meal-chip open" : "filter-button meal-chip"}
        onClick={() => (open ? closeMenu() : setOpen(true))}
        type="button"
      >
        {meal} <Icon name="abfcb.svg" />
      </button>
      {open && (
        <div className={closing ? "meal-menu closing" : "meal-menu"} role="listbox">
          {(["Breakfast", "Lunch", "Dinner"] as Meal[]).map((option) => (
            <button
              aria-selected={meal === option}
              className={meal === option ? "active" : ""}
              key={option}
              onClick={() => {
                setMeal(option);
                closeMenu(120);
              }}
              role="option"
              type="button"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const dietChips: Record<string, { label: string; color: string }> = {
  V: { label: "Vegan", color: "#467858" },
  VG_GREEN: { label: "Vegan", color: "#467858" },
  VG: { label: "Vegetarian", color: "#676835" },
  J: { label: "Jain", color: "#f97841" },
};

const allergenChips: Record<string, { label: string; icon: string; width: number }> = {
  BEAN: { label: "Soy", icon: "bean-chip.svg", width: 13.59 },
  EGG: { label: "Egg", icon: "f73a5.svg", width: 16.8 },
  MILK: { label: "Milk", icon: "73380.svg", width: 11.23 },
  WHEAT: { label: "Wheat", icon: "8fd74.svg", width: 16.8 },
};

const nutrition = [
  ["Calories", "170"],
  ["Sodium", "230g"],
  ["Total Fat", "12g"],
  ["Total Carbohydrate", "5g"],
  ["Saturated Fat", "1.5g"],
  ["Dietary Fiber", "3g"],
  ["Trans Fat", "0g"],
  ["Sugars", "1g"],
  ["Cholesterol", "0mg"],
  ["Protein", "11g"],
];

const ingredients: Record<string, string[]> = {
  'Seared tofu "steak" with balsamic glazed mushrooms': [
    "Tofu",
    "Mushrooms",
    "Olive oil",
    "Balsamic vinegar",
    "Brown Sugar",
    "Salt",
    "Shallots",
    "Rosemary",
  ],
  "Tofu bolognese": ["Tofu", "Crushed tomatoes", "Garlic", "Onion", "Olive oil", "Basil", "Oregano"],
  "Rosemary roasted tofu": ["Tofu", "Rosemary", "Garlic", "Olive oil", "Salt", "Black pepper"],
  "Tahu goreng bumbu kuning - turmeric fried tofu": ["Tofu", "Turmeric", "Coriander", "Garlic", "Shallots", "Coconut oil"],
};

function ItemSheet({
  item,
  onClose,
  onDismissStart,
}: {
  item: MenuItem;
  onClose: () => void;
  onDismissStart: () => void;
}) {
  const { layerProps, sheetProps } = useSheetDrag(onClose, onDismissStart);
  const itemIngredients = ingredients[item.name] ?? [];

  return (
    <div {...layerProps}>
      <section
        aria-label={item.name}
        aria-modal="true"
        className="item-sheet"
        role="dialog"
        {...sheetProps}
      >
        <div className="sheet-handle" />
        <div className="item-sheet-content">
          <header className="item-heading">
            <h2>{item.name}</h2>
            <div className="item-chips">
              {item.tags.filter((tag) => dietChips[tag]).map((tag) => (
                <span className="diet-chip" key={tag} style={{ background: dietChips[tag].color }}>
                  {dietChips[tag].label}
                </span>
              ))}
              {item.tags.filter((tag) => allergenChips[tag]).map((tag) => (
                <span className="allergen-chip" key={tag}>
                  <span className="allergen-chip-icon">
                    <img alt="" src={`${assets}/${allergenChips[tag].icon}`} style={{ width: allergenChips[tag].width }} />
                  </span>
                  Contains {allergenChips[tag].label}
                </span>
              ))}
            </div>
          </header>

          <section className="nutrition">
            <div className="nutrition-heading">
              <h3>Nutritional Information</h3>
              <span>Serving Size: 5.5 oz</span>
            </div>
            <div className="nutrition-table">
              {nutrition.map(([label, value], index) => (
                <div className={Math.floor(index / 2) % 2 === 1 ? "nutrition-cell striped" : "nutrition-cell"} key={label}>
                  <span>{label}</span>
                  <span>{value}</span>
                </div>
              ))}
            </div>
          </section>

          {itemIngredients.length > 0 && (
            <section className="ingredients">
              <h3>Ingredients</h3>
              <div className="ingredient-chips">
                {itemIngredients.map((ingredient) => <span key={ingredient}>{ingredient}</span>)}
              </div>
            </section>
          )}
        </div>
      </section>
    </div>
  );
}

function SearchHeader({
  filterOpen,
  filters,
  meal,
  onBack,
  onFilter,
  onRemoveFilter,
  query,
  setMeal,
  setQuery,
}: {
  filterOpen: boolean;
  filters: string[];
  meal: Meal;
  onBack: () => void;
  onFilter: () => void;
  onRemoveFilter: (value: string) => void;
  query: string;
  setMeal: (meal: Meal) => void;
  setQuery: (value: string) => void;
}) {
  return (
    <header className="search-header">
      <div className="search-row">
        <button aria-label="Close search" className="close-button" onClick={onBack} type="button">
          <Icon name="d4349.svg" />
        </button>
        <label className="search-field">
          <SearchIcon />
          <input
            aria-label="Search menus"
            autoFocus
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search Menus"
            value={query}
          />
        </label>
      </div>
      <div className="filter-controls detailed">
        <div className="filter-chips">
          <button className={filterOpen ? "filter-button open" : "filter-button"} onClick={onFilter} type="button">
            Filter <Icon name="abfcb.svg" />
          </button>
          <MealDropdown meal={meal} setMeal={setMeal} />
          <span className="date-chip">10/09/2026</span>
        </div>
        {filters.length > 0 && (
          <div className="dietary-chips">
            {filters.map((filter) => (
              <button
                aria-label={`Remove ${filter} filter`}
                className="active-filter"
                key={filter}
                onClick={() => onRemoveFilter(filter)}
                type="button"
              >
                {filterLabel(filter)} <Icon name="9bbd9.svg" />
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}

function FoodDot({ tag }: { tag: string }) {
  const allergenAssets: Record<string, string> = {
    BEAN: "6debf.svg",
    EGG: "f73a5.svg",
    MILK: "73380.svg",
    WHEAT: "8fd74.svg",
  };

  if (allergenAssets[tag]) {
    return (
      <span className="food-dot tag-allergen">
        <Icon name={allergenAssets[tag]} />
      </span>
    );
  }

  if (tag === "VG_GREEN") {
    return <span className="food-dot tag-vg-green">VG</span>;
  }

  return <span className={`food-dot tag-${tag.toLowerCase()}`}>{tag}</span>;
}

const filteredResults = [
  {
    hall: "HILL HOUSE",
    station: "Vegan",
    item: { name: 'Seared tofu "steak" with balsamic glazed mushrooms', tags: ["VG_GREEN", "BEAN"] },
  },
  {
    hall: "ENGLISH HOUSE",
    station: "Expo",
    item: { name: "Tofu bolognese", tags: ["VG_GREEN", "BEAN"] },
  },
  {
    hall: "LAUDER COLLEGE HOUSE",
    station: "Vegan",
    item: { name: "Rosemary roasted tofu", tags: ["VG_GREEN", "BEAN"] },
  },
  {
    hall: "QUAKER KITCHEN",
    station: "Main Course",
    item: { name: "Tahu goreng bumbu kuning - turmeric fried tofu", tags: ["VG_GREEN", "BEAN"] },
  },
];

function slideToHall(article: HTMLElement | null) {
  const list = article?.parentElement;
  if (!article || !list) return;
  // Halls already near the top stay put, so the halls above remain visible.
  const visibleTop = article.offsetTop - list.scrollTop;
  if (visibleTop >= 0 && visibleTop < list.clientHeight * 0.4) return;
  // Leave room for the previous hall's header above the one being opened.
  const target = Math.max(0, article.offsetTop - 80);
  const align = () => list.scrollTo({ top: target, behavior: "smooth" });
  requestAnimationFrame(align);
  // The hall is still expanding on the first pass, so re-align once it settles.
  window.setTimeout(() => {
    if (Math.abs(list.scrollTop - target) > 2) align();
  }, 300);
}

function VenueTabs({
  activeTab,
  onChange,
}: {
  activeTab: string;
  onChange: (tab: string) => void;
}) {
  const navRef = useRef<HTMLElement>(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  useLayoutEffect(() => {
    const nav = navRef.current;
    const active = nav?.querySelector<HTMLButtonElement>("button.active");
    if (!nav || !active) return;
    setIndicator({ left: active.offsetLeft, width: active.offsetWidth });
    nav.scrollTo({
      left: active.offsetLeft - (nav.clientWidth - active.offsetWidth) / 2,
      behavior: "smooth",
    });
  }, [activeTab]);

  return (
    <nav aria-label="Dining halls" className="venue-tabs" ref={navRef}>
      {tabs.map((tab) => (
        <button
          className={activeTab === tab ? "active" : ""}
          key={tab}
          onClick={() => onChange(tab)}
          type="button"
        >
          {tab}
        </button>
      ))}
      <span
        aria-hidden="true"
        className="tab-indicator"
        style={{ transform: `translateX(${indicator.left}px)`, width: indicator.width }}
      />
    </nav>
  );
}

function FilteredResults({ onSelectItem }: { onSelectItem: (item: MenuItem) => void }) {
  const [activeTab, setActiveTab] = useState("All");
  const [openHalls, setOpenHalls] = useState<number[]>([]);
  const [openStations, setOpenStations] = useState<number[]>(
    filteredResults.map((_, index) => index),
  );
  const visibleResults = activeTab === "All"
    ? filteredResults.map((result, index) => ({ result, index }))
    : filteredResults
        .map((result, index) => ({ result, index }))
        .filter(({ result }) =>
          result.hall.toUpperCase().startsWith(activeTab.toUpperCase()),
        );

  const toggleIndex = (
    index: number,
    values: number[],
    setValues: (values: number[]) => void,
  ) => {
    setValues(
      values.includes(index)
        ? values.filter((value) => value !== index)
        : [...values, index],
    );
  };

  return (
    <>
      <VenueTabs activeTab={activeTab} onChange={setActiveTab} />
      <section className="filtered-results" aria-live="polite">
        {visibleResults.map(({ result, index }) => {
          const hallOpen = activeTab !== "All" || openHalls.includes(index);
          const stationOpen = openStations.includes(index);
          return (
            <article className={hallOpen ? "filtered-hall open" : "filtered-hall"} key={`${result.hall}-${result.station}-${index}`}>
              <button
                className="filtered-hall-header"
                disabled={activeTab !== "All"}
                onClick={(event) => {
                  if (!hallOpen) slideToHall(event.currentTarget.closest("article"));
                  toggleIndex(index, openHalls, setOpenHalls);
                }}
                type="button"
              >
                <strong>{result.hall}</strong>
                {activeTab === "All" && <Icon name={hallOpen ? "81e74.svg" : "a10e5.svg"} />}
              </button>
              <div className={hallOpen ? "hall-collapse open" : "hall-collapse"}>
                <div>
                  <section className={stationOpen ? "station open" : "station"}>
                    <button
                      onClick={() => toggleIndex(index, openStations, setOpenStations)}
                      type="button"
                    >
                      <strong>{result.station}</strong>
                      <Icon
                        className={stationOpen ? "option-arrow up" : "option-arrow"}
                        name="f451b.svg"
                      />
                    </button>
                    <div className={stationOpen ? "food-collapse open" : "food-collapse"}>
                      <div>
                        <div className="food-list">
                          <button className="food-row" onClick={() => onSelectItem(result.item)} type="button">
                            <span className={result.item.name.length > 30 ? "food-name long" : "food-name"}>
                              {result.item.name}
                            </span>
                            <span className="food-tags">
                              {result.item.tags.map((tag) => <FoodDot key={tag} tag={tag} />)}
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </>
  );
}

function SearchResults({
  initialStationsOpen,
  onSelectItem,
  query,
}: {
  initialStationsOpen: boolean;
  onSelectItem: (item: MenuItem) => void;
  query: string;
}) {
  const [activeTab, setActiveTab] = useState("All");
  const [openHalls, setOpenHalls] = useState<string[]>([]);
  const [openStations, setOpenStations] = useState<string[]>(
    initialStationsOpen
      ? halls.flatMap((hall) => hall.stations.map((station) => `${hall.name}-${station.name}`))
      : [],
  );

  const filteredHalls = useMemo(() => {
    if (activeTab === "All") return halls;
    return halls.filter((hall) => hall.name.startsWith(activeTab.toUpperCase()));
  }, [activeTab]);

  const toggleHall = (hall: string) => {
    setOpenHalls((current) =>
      current.includes(hall)
        ? current.filter((item) => item !== hall)
        : [...current, hall],
    );
  };

  const toggleStation = (key: string) => {
    setOpenStations((current) =>
      current.includes(key)
        ? current.filter((item) => item !== key)
        : [...current, key],
    );
  };

  return (
    <>
      <VenueTabs activeTab={activeTab} onChange={setActiveTab} />
      <section className="results-list" aria-live="polite">
        {filteredHalls.map((hall) => {
          const isOpen = activeTab !== "All" || openHalls.includes(hall.name);
          return (
            <article className={isOpen ? "hall-result open" : "hall-result"} key={hall.name}>
              <button
                className="hall-title"
                disabled={activeTab !== "All"}
                onClick={(event) => {
                  if (!isOpen) slideToHall(event.currentTarget.closest("article"));
                  toggleHall(hall.name);
                }}
                type="button"
              >
                <strong>{hall.name}</strong>
                {activeTab === "All" && <Icon name={isOpen ? "81e74.svg" : "a10e5.svg"} />}
              </button>
              <div className={isOpen && hall.stations.length > 0 ? "hall-collapse open" : "hall-collapse"}>
                <div>
                  <div className="station-list">
                  {hall.stations.map((station) => {
                    const stationKey = `${hall.name}-${station.name}`;
                    const stationOpen = openStations.includes(stationKey);
                    const matchingItems = query
                      ? station.items.filter((item) =>
                          item.name.toLowerCase().includes(query.toLowerCase()),
                        )
                      : station.items;
                    return (
                      <section className={stationOpen ? "station open" : "station"} key={stationKey}>
                        <button onClick={() => toggleStation(stationKey)} type="button">
                          <strong>
                            {stationOpen
                              ? station.name
                              : station.name.toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase())}
                          </strong>
                          <Icon
                            className={stationOpen ? "option-arrow up" : "option-arrow"}
                            name="f451b.svg"
                          />
                        </button>
                        <div className={stationOpen && matchingItems.length > 0 ? "food-collapse open" : "food-collapse"}>
                          <div>
                            <div className="food-list">
                              {matchingItems.map((item) => (
                                <button className="food-row" key={item.name} onClick={() => onSelectItem(item)} type="button">
                                  <span className={item.name.length > 30 ? "food-name long" : "food-name"}>
                                    {item.name}
                                  </span>
                                  <span className="food-tags">
                                    {item.tags.map((tag) => <FoodDot key={tag} tag={tag} />)}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </section>
                    );
                  })}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </>
  );
}

function SearchPage({ initialFilterOpen = false, onBack }: { initialFilterOpen?: boolean; onBack: () => void }) {
  const [query, setQuery] = useState("");
  const [sheetOpen, setSheetOpen] = useState(initialFilterOpen);
  const [meal, setMeal] = useState<Meal>("Breakfast");
  const [filters, setFilters] = useState<string[]>([]);
  const [recent, setRecent] = useState(["Chicken", "Rice"]);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [filterClosing, setFilterClosing] = useState(false);
  const [itemClosing, setItemClosing] = useState(false);
  const filterActive = sheetOpen && !filterClosing;
  const itemActive = selectedItem !== null && !itemClosing;
  const resultsKey = `${meal}-${filters.join("|")}`;
  const hasResults = query.trim().length > 0 || filters.length > 0;
  const showFilteredFrame = query.trim().toLowerCase() === "tofu";

  const saveFilters = (nextMeal: Meal, values: string[]) => {
    setMeal(nextMeal);
    setFilters(values);
  };

  return (
    <main className={filters.length > 0 ? "search-page filtered" : "search-page"}>
      <SearchHeader
        filterOpen={filterActive}
        filters={filters}
        meal={meal}
        onBack={onBack}
        onFilter={() => setSheetOpen(true)}
        onRemoveFilter={(value) => setFilters((current) => current.filter((item) => item !== value))}
        query={query}
        setMeal={setMeal}
        setQuery={setQuery}
      />

      {showFilteredFrame ? (
        <FilteredResults key={resultsKey} onSelectItem={setSelectedItem} />
      ) : hasResults ? (
        <SearchResults
          initialStationsOpen={query.trim().length === 0}
          key={resultsKey}
          onSelectItem={setSelectedItem}
          query={query}
        />
      ) : (
        <section className="search-empty">
          <h2>Recent Searches</h2>
          {recent.map((item) => (
            <div className="recent-row" key={item}>
              <Icon name="753db.svg" />
              <button onClick={() => setQuery(item)} type="button">{item}</button>
              <button
                aria-label={`Remove ${item} from recent searches`}
                onClick={() => setRecent((current) => current.filter((value) => value !== item))}
                type="button"
              >
                <Icon name="93f56.svg" />
              </button>
            </div>
          ))}
          <h2 className="recommended">Recommended</h2>
          <div className="recommended-chips">
            <button onClick={() => setQuery("Tofu")} type="button">Tofu</button>
            <button onClick={() => setFilters(["Vegetarian"])} type="button">Vegetarian</button>
          </div>
        </section>
      )}
      {!hasResults && !sheetOpen && (
        <div className="keyboard-preview" aria-hidden="true">
          <Icon name="70ab6.png" />
        </div>
      )}

      {sheetOpen && (
        <FilterSheet
          initialMeal={meal}
          initialSelected={filters}
          onClose={() => {
            setSheetOpen(false);
            setFilterClosing(false);
          }}
          onDismissStart={() => setFilterClosing(true)}
          onSave={saveFilters}
        />
      )}

      <BottomNav hidden={!hasResults || filterActive || itemActive} />

      {selectedItem && (
        <ItemSheet
          item={selectedItem}
          onClose={() => {
            setSelectedItem(null);
            setItemClosing(false);
          }}
          onDismissStart={() => setItemClosing(true)}
        />
      )}
    </main>
  );
}

function StatusBar() {
  return (
    <>
      <div className="dynamic-island" aria-hidden="true">
        <span />
      </div>
      <div className="status-bar" aria-label="Phone status">
        <time>9:41</time>
        <div className="status-indicators">
          <Icon name="9cf1b.svg" />
          <Icon name="24a95.svg" />
          <Icon name="00e20.svg" />
        </div>
      </div>
      <div className="home-indicator" aria-hidden="true" />
    </>
  );
}

function TouchCursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = ref.current;
    if (!cursor) return;
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
      const overStage = (event.target as Element | null)?.closest?.(".device-stage");
      cursor.classList.toggle("visible", Boolean(overStage));
    };
    const press = () => cursor.classList.add("pressed");
    const release = () => cursor.classList.remove("pressed");
    const hide = () => cursor.classList.remove("visible");
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerdown", press);
    window.addEventListener("pointerup", release);
    document.documentElement.addEventListener("mouseleave", hide);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", press);
      window.removeEventListener("pointerup", release);
      document.documentElement.removeEventListener("mouseleave", hide);
    };
  }, []);

  return (
    <div aria-hidden="true" className="touch-cursor" ref={ref}>
      <span />
    </div>
  );
}

export default function App() {
  const [searching, setSearching] = useState(false);
  const [morphingSearch, setMorphingSearch] = useState(false);
  const [openWithFilter, setOpenWithFilter] = useState(false);

  const openSearch = (withFilter = false) => {
    setOpenWithFilter(withFilter);
    setSearching(true);
    setMorphingSearch(true);
  };

  return (
    <>
    <TouchCursor />
    <div className="device-stage">
      <div className="iphone-case">
        <span className="case-button action-button" />
        <span className="case-button volume-up" />
        <span className="case-button volume-down" />
        <span className="case-button side-button" />
        <div className={morphingSearch ? "phone-screen morphing-search" : "phone-screen"}>
          <StatusBar />
          {morphingSearch && (
            <div
              className="search-morph-ghost"
              onAnimationEnd={() => setMorphingSearch(false)}
            >
              <SearchIcon />
              <span>Search Menus</span>
            </div>
          )}
          <div className="phone-content">
            {searching
              ? <SearchPage initialFilterOpen={openWithFilter} onBack={() => {
                  setMorphingSearch(false);
                  setSearching(false);
                }} />
              : <DiningHome onSearch={openSearch} />}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
