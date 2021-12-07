import React, { useState } from 'react';
import { Item } from '../../stories/items';
import './Modal.css';
import { MultiSelect } from './Multiselect';

type Props = {
  args: any;
  onSelect: (items: Item[]) => void;
  value?: Item[];
  items: Item[];
};

export const Modal: React.FC<Props> = ({ args, value, onSelect }) => {
  const [state, setState] = useState<boolean>(true);

  const toggle = () => {
    setState((value) => !value);
  };

  return (
    <div className="modal-wrapper">
      <button onClick={toggle} type="button">
        open modal
      </button>

      {state && (
        <div className="modal">
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea quo numquam explicabo iusto
            hic. Error, maxime sequi dolorem corrupti commodi modi sed consectetur fuga quos,
            nostrum eveniet culpa cumque nesciunt! Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Ea quo numquam explicabo iusto hic. Error, maxime sequi dolorem
            corrupti commodi modi sed consectetur fuga quos, nostrum eveniet culpa cumque nesciunt!
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea quo numquam explicabo iusto
            hic. Error, maxime sequi dolorem corrupti commodi modi sed consectetur fuga quos,
            nostrum eveniet culpa cumque nesciunt! Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Ea quo numquam explicabo iusto hic. Error, maxime sequi dolorem
            corrupti commodi modi sed consectetur fuga quos, nostrum eveniet culpa cumque nesciunt!
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea quo numquam explicabo iusto
            hic. Error, maxime sequi dolorem corrupti commodi modi sed consectetur fuga quos,
            nostrum eveniet culpa cumque nesciunt! Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Ea quo numquam explicabo iusto hic. Error, maxime sequi dolorem
            corrupti commodi modi sed consectetur fuga quos, nostrum eveniet culpa cumque nesciunt!
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea quo numquam explicabo iusto
            hic. Error, maxime sequi dolorem corrupti commodi modi sed consectetur fuga quos,
            nostrum eveniet culpa cumque nesciunt! Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Ea quo numquam explicabo iusto hic. Error, maxime sequi dolorem
            corrupti commodi modi sed consectetur fuga quos, nostrum eveniet culpa cumque nesciunt!
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea quo numquam explicabo iusto
            hic. Error, maxime sequi dolorem corrupti commodi modi sed consectetur fuga quos,
            nostrum eveniet culpa cumque nesciunt! Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Ea quo numquam explicabo iusto hic. Error, maxime sequi dolorem
            corrupti commodi modi sed consectetur fuga quos, nostrum eveniet culpa cumque nesciunt!
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea quo numquam explicabo iusto
            hic. Error, maxime sequi dolorem corrupti commodi modi sed consectetur fuga quos,
            nostrum eveniet culpa cumque nesciunt! Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Ea quo numquam explicabo iusto hic. Error, maxime sequi dolorem
            corrupti commodi modi sed consectetur fuga quos, nostrum eveniet culpa cumque nesciunt!
          </p>
          <MultiSelect {...args} value={value} onSelect={onSelect} />
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea quo numquam explicabo iusto
            hic. Error, maxime sequi dolorem corrupti commodi modi sed consectetur fuga quos,
            nostrum eveniet culpa cumque nesciunt! Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Ea quo numquam explicabo iusto hic. Error, maxime sequi dolorem
            corrupti commodi modi sed consectetur fuga quos, nostrum eveniet culpa cumque nesciunt!
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea quo numquam explicabo iusto
            hic. Error, maxime sequi dolorem corrupti commodi modi sed consectetur fuga quos,
            nostrum eveniet culpa cumque nesciunt! Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Ea quo numquam explicabo iusto hic. Error, maxime sequi dolorem
            corrupti commodi modi sed consectetur fuga quos, nostrum eveniet culpa cumque nesciunt!
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea quo numquam explicabo iusto
            hic. Error, maxime sequi dolorem corrupti commodi modi sed consectetur fuga quos,
            nostrum eveniet culpa cumque nesciunt! Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Ea quo numquam explicabo iusto hic. Error, maxime sequi dolorem
            corrupti commodi modi sed consectetur fuga quos, nostrum eveniet culpa cumque nesciunt!
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea quo numquam explicabo iusto
            hic. Error, maxime sequi dolorem corrupti commodi modi sed consectetur fuga quos,
            nostrum eveniet culpa cumque nesciunt! Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Ea quo numquam explicabo iusto hic. Error, maxime sequi dolorem
            corrupti commodi modi sed consectetur fuga quos, nostrum eveniet culpa cumque nesciunt!
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea quo numquam explicabo iusto
            hic. Error, maxime sequi dolorem corrupti commodi modi sed consectetur fuga quos,
            nostrum eveniet culpa cumque nesciunt! Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Ea quo numquam explicabo iusto hic. Error, maxime sequi dolorem
            corrupti commodi modi sed consectetur fuga quos, nostrum eveniet culpa cumque nesciunt!
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea quo numquam explicabo iusto
            hic. Error, maxime sequi dolorem corrupti commodi modi sed consectetur fuga quos,
            nostrum eveniet culpa cumque nesciunt! Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Ea quo numquam explicabo iusto hic. Error, maxime sequi dolorem
            corrupti commodi modi sed consectetur fuga quos, nostrum eveniet culpa cumque nesciunt!
          </p>
        </div>
      )}
    </div>
  );
};
