#ifndef __DEVICE_H__
#define __DEVICE_H__

#define IS_FLAG_SET(x, b)					(x & b)
#define FLAG_SET(x, b)						(x |= b)
#define FLAG_CLR(x, b)						(x &= (~b))

class Device {
	public:
		//virtual ~Device() {}					// A virtual destructor
		//virtual void draw() = 0;             // A pure virtual function

		// constructors cannot be declared virtual
		//virtual Device() {}
		//virtual Shape* clone()  const = 0;   // Uses the copy constructor
		//virtual Shape* create() const = 0;   // Uses the default constructor

		virtual void init(void);
		virtual int error(void);
		virtual int initialized(void);
		virtual void process(void);
 };

#endif
