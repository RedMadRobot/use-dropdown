import React, { useState } from 'react';
import './Modal.css';

export const Modal: React.FC = (props) => {
  const [state, setState] = useState<boolean>(false);

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
          {props.children}
        </div>
      )}
    </div>
  );
};
